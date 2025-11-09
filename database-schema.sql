-- Grateful & Roasted Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Games table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(6) UNIQUE NOT NULL,
    host_id VARCHAR(255) NOT NULL, -- Clerk user ID
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'setup', -- setup, collecting, revealing, voting, completed
    game_mode VARCHAR(20) NOT NULL DEFAULT 'gratitude', -- gratitude, roast, both
    current_round INTEGER DEFAULT 1,
    max_rounds INTEGER DEFAULT 1,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    is_host BOOLEAN DEFAULT FALSE,
    session_id VARCHAR(255) UNIQUE, -- For anonymous players
    score INTEGER DEFAULT 0,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(game_id, name)
);

-- Submissions table
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    round INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL, -- gratitude, roast
    content TEXT NOT NULL,
    target_player_id UUID REFERENCES players(id), -- For roasts
    is_revealed BOOLEAN DEFAULT FALSE,
    revealed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes table (for guessing who wrote what)
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    voter_player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    guessed_player_id UUID REFERENCES players(id),
    is_correct BOOLEAN,
    points_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(submission_id, voter_player_id)
);

-- Reactions table (for emoji reactions to submissions)
CREATE TABLE reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(submission_id, player_id, emoji)
);

-- Create indexes for better performance
CREATE INDEX idx_games_code ON games(code);
CREATE INDEX idx_games_host_id ON games(host_id);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_players_game_id ON players(game_id);
CREATE INDEX idx_players_session_id ON players(session_id);
CREATE INDEX idx_submissions_game_id ON submissions(game_id);
CREATE INDEX idx_submissions_player_id ON submissions(player_id);
CREATE INDEX idx_submissions_round ON submissions(round);
CREATE INDEX idx_votes_game_id ON votes(game_id);
CREATE INDEX idx_votes_submission_id ON votes(submission_id);
CREATE INDEX idx_reactions_submission_id ON reactions(submission_id);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Games: Anyone can read, only host can update/delete
CREATE POLICY "Games are viewable by everyone"
    ON games FOR SELECT
    USING (true);

CREATE POLICY "Hosts can insert their own games"
    ON games FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Hosts can update their own games"
    ON games FOR UPDATE
    USING (true);

CREATE POLICY "Hosts can delete their own games"
    ON games FOR DELETE
    USING (true);

-- Players: Everyone in game can view, anyone can join
CREATE POLICY "Players are viewable by everyone"
    ON players FOR SELECT
    USING (true);

CREATE POLICY "Anyone can join a game as a player"
    ON players FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Players can update their own data"
    ON players FOR UPDATE
    USING (true);

-- Submissions: Viewable by game participants, writable by player
CREATE POLICY "Submissions are viewable by game participants"
    ON submissions FOR SELECT
    USING (true);

CREATE POLICY "Players can create submissions"
    ON submissions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Players can update their own submissions"
    ON submissions FOR UPDATE
    USING (true);

-- Votes: Viewable after reveal, writable by voters
CREATE POLICY "Votes are viewable by everyone"
    ON votes FOR SELECT
    USING (true);

CREATE POLICY "Players can vote"
    ON votes FOR INSERT
    WITH CHECK (true);

-- Reactions: Everyone can view and create
CREATE POLICY "Reactions are viewable by everyone"
    ON reactions FOR SELECT
    USING (true);

CREATE POLICY "Players can react"
    ON reactions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Players can remove their reactions"
    ON reactions FOR DELETE
    USING (true);

-- Function to generate unique game codes
CREATE OR REPLACE FUNCTION generate_game_code()
RETURNS VARCHAR(6) AS $$
DECLARE
    new_code VARCHAR(6);
    code_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate random 6-character code (uppercase letters and numbers)
        new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));

        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM games WHERE code = new_code) INTO code_exists;

        -- Exit loop if code is unique
        EXIT WHEN NOT code_exists;
    END LOOP;

    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate game code
CREATE OR REPLACE FUNCTION set_game_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.code IS NULL OR NEW.code = '' THEN
        NEW.code := generate_game_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_game_code
    BEFORE INSERT ON games
    FOR EACH ROW
    EXECUTE FUNCTION set_game_code();

-- Trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
