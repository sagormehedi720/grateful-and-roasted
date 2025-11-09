export type GameStatus = 'setup' | 'collecting' | 'revealing' | 'voting' | 'completed';
export type GameMode = 'gratitude' | 'roast' | 'both';
export type SubmissionType = 'gratitude' | 'roast';

export interface Game {
  id: string;
  code: string;
  host_id: string;
  name: string;
  status: GameStatus;
  game_mode: GameMode;
  current_round: number;
  max_rounds: number;
  settings: GameSettings;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
}

export interface GameSettings {
  allow_anonymous?: boolean;
  require_target_for_roast?: boolean;
  enable_voting?: boolean;
  voting_time_limit?: number; // seconds
  reveal_authors_after_voting?: boolean;
  max_submissions_per_player?: number;
  enable_reactions?: boolean;
}

export interface Player {
  id: string;
  game_id: string;
  name: string;
  avatar_url: string | null;
  is_host: boolean;
  session_id: string | null;
  score: number;
  joined_at: string;
  last_active: string;
}

export interface Submission {
  id: string;
  game_id: string;
  player_id: string;
  round: number;
  type: SubmissionType;
  content: string;
  target_player_id: string | null;
  is_revealed: boolean;
  revealed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: string;
  game_id: string;
  submission_id: string;
  voter_player_id: string;
  guessed_player_id: string | null;
  is_correct: boolean | null;
  points_awarded: number;
  created_at: string;
}

export interface Reaction {
  id: string;
  submission_id: string;
  player_id: string;
  emoji: string;
  created_at: string;
}

// Extended types with relations
export interface SubmissionWithPlayer extends Submission {
  player: Player;
  target_player?: Player;
}

export interface SubmissionWithVotes extends SubmissionWithPlayer {
  votes: Vote[];
  reactions: Reaction[];
}

export interface GameWithPlayers extends Game {
  players: Player[];
}

export interface PlayerWithStats extends Player {
  total_submissions: number;
  total_votes: number;
  correct_votes: number;
}
