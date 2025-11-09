'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Game } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { playSound } from '@/lib/sounds';
import { Users, Loader2 } from 'lucide-react';

export default function JoinGamePage() {
  const params = useParams();
  const router = useRouter();
  const code = (params?.code as string)?.toUpperCase();

  const [game, setGame] = useState<Game | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (code) {
      fetchGame();
    }
  }, [code]);

  const fetchGame = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('code', code)
        .single();

      if (error) {
        setError('Game not found. Please check the code and try again.');
        return;
      }

      if (data.status === 'completed') {
        setError('This game has already finished.');
        return;
      }

      setGame(data);
    } catch (err) {
      console.error('Error fetching game:', err);
      setError('Failed to load game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    if (!playerName.trim()) {
      playSound('error', 0.3);
      setError('Please enter your name');
      return;
    }

    if (!game) return;

    setJoining(true);
    setError('');

    try {
      // Check if name is already taken
      const { data: existingPlayers } = await supabase
        .from('players')
        .select('name')
        .eq('game_id', game.id)
        .eq('name', playerName.trim());

      if (existingPlayers && existingPlayers.length > 0) {
        playSound('error', 0.3);
        setError('This name is already taken. Please choose a different name.');
        setJoining(false);
        return;
      }

      // Create player
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const { data: player, error: playerError } = await supabase
        .from('players')
        .insert({
          game_id: game.id,
          name: playerName.trim(),
          session_id: sessionId,
          is_host: false,
        })
        .select()
        .single();

      if (playerError) {
        console.error('Error creating player:', playerError);
        playSound('error', 0.3);
        setError('Failed to join game. Please try again.');
        setJoining(false);
        return;
      }

      // Success! Play a fun turkey sound
      playSound('turkey', 0.5);

      // Store session in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('grateful_roasted_session', sessionId);
        localStorage.setItem('grateful_roasted_player_id', player.id);
        localStorage.setItem('grateful_roasted_game_id', game.id);
      }

      // Redirect to play page
      router.push(`/game/${game.id}/play`);
    } catch (err) {
      console.error('Error joining game:', err);
      setError('Failed to join game. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error && !game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50 px-4">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-4">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/')} className="w-full">
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50 px-4">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🦃</div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Join the Fun!
          </h1>
          {game && (
            <div>
              <p className="text-xl font-semibold text-gray-800 mb-2">
                {game.name}
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">Game Code: {game.code}</span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-base">
              What's your name?
            </Label>
            <Input
              id="playerName"
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError('');
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleJoinGame();
                }
              }}
              className="text-lg py-6"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>

          <Button
            onClick={handleJoinGame}
            disabled={joining || !playerName.trim()}
            className="w-full text-lg py-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            {joining ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              'Join Game'
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              By joining, you agree to keep it fun and respectful!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
