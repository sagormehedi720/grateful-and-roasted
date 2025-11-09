'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Game, Player, Submission } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { playSound } from '@/lib/sounds';
import { SoundToggle } from '@/components/SoundToggle';
import QRCode from 'react-qr-code';
import {
  Users,
  Play,
  Eye,
  CheckCircle,
  Settings,
  Copy,
  Check,
} from 'lucide-react';

export default function GamePage() {
  const params = useParams();
  const gameId = params?.gameId as string;

  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);
  const prevPlayerCount = useRef(0);

  const joinUrl = `${process.env.NEXT_PUBLIC_APP_URL}/join/${game?.code}`;

  useEffect(() => {
    if (gameId) {
      fetchGameData();
      setupRealtimeSubscriptions();
    }

    return () => {
      // Cleanup subscriptions
      supabase.channel(`game:${gameId}`).unsubscribe();
    };
  }, [gameId]);

  const fetchGameData = async () => {
    try {
      // Fetch game
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (gameError) throw gameError;
      setGame(gameData);

      // Fetch players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .eq('game_id', gameId)
        .order('joined_at', { ascending: true });

      if (playersError) throw playersError;

      // Play sound when new player joins
      if (playersData && playersData.length > prevPlayerCount.current) {
        playSound('player-join', 0.3);
      }
      prevPlayerCount.current = playersData?.length || 0;

      setPlayers(playersData || []);

      // Fetch submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('game_id', gameId);

      if (submissionsError) throw submissionsError;
      setSubmissions(submissionsData || []);
    } catch (error) {
      console.error('Error fetching game data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const channel = supabase.channel(`game:${gameId}`);

    // Subscribe to players
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'players',
        filter: `game_id=eq.${gameId}`,
      },
      () => {
        fetchGameData();
      }
    );

    // Subscribe to submissions
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'submissions',
        filter: `game_id=eq.${gameId}`,
      },
      () => {
        fetchGameData();
      }
    );

    // Subscribe to game updates
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`,
      },
      () => {
        fetchGameData();
      }
    );

    channel.subscribe();
  };

  const handleStartCollecting = async () => {
    try {
      playSound('game-start', 0.5);
      const { error } = await supabase
        .from('games')
        .update({ status: 'collecting', started_at: new Date().toISOString() })
        .eq('id', gameId);

      if (error) throw error;
    } catch (error) {
      console.error('Error starting game:', error);
      playSound('error', 0.3);
      alert('Failed to start game');
    }
  };

  const handleStartRevealing = async () => {
    try {
      playSound('reveal', 0.4);
      const { error } = await supabase
        .from('games')
        .update({ status: 'revealing' })
        .eq('id', gameId);

      if (error) throw error;
    } catch (error) {
      console.error('Error starting reveal:', error);
      playSound('error', 0.3);
      alert('Failed to start reveal');
    }
  };

  const copyCode = () => {
    if (game?.code) {
      navigator.clipboard.writeText(game.code);
      playSound('click', 0.2);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const copyJoinUrl = () => {
    navigator.clipboard.writeText(joinUrl);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🦃</div>
          <p className="text-gray-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🦃</div>
          <p className="text-gray-600">Game not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50">
      {/* TV/Large Screen View - Optimized for Display */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-8 py-8">
          {/* Game Header */}
          <div className="text-center mb-8 relative">
            <div className="absolute top-0 right-4">
              <SoundToggle />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {game.name}
            </h1>
            <div className="flex items-center justify-center gap-4">
              <Badge className="text-lg px-4 py-2">
                {game.status.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {players.length} Players
              </Badge>
            </div>
          </div>
          {game.status === 'setup' && (
            <div className="grid grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* QR Code Section */}
              <Card className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-6">Scan to Join</h2>
                <div className="bg-white p-8 rounded-xl inline-block mb-6">
                  <QRCode value={joinUrl} size={300} />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 mb-2">Or enter code:</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-6xl font-bold tracking-wider">
                        {game.code}
                      </span>
                      <Button size="icon" variant="ghost" onClick={copyCode}>
                        {codeCopied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{joinUrl}</p>
                </div>
              </Card>

              {/* Players Section */}
              <Card className="p-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                  <Users className="w-8 h-8" />
                  Players ({players.length})
                </h2>
                <div className="space-y-3 mb-8">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-lg">{player.name}</p>
                        {player.is_host && (
                          <Badge variant="outline" className="text-xs">
                            Host
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  size="lg"
                  className="w-full text-xl py-6"
                  onClick={handleStartCollecting}
                  disabled={players.length < 2}
                >
                  <Play className="w-6 h-6 mr-2" />
                  Start Game
                </Button>
                {players.length < 2 && (
                  <p className="text-sm text-gray-500 text-center mt-4">
                    Need at least 2 players to start
                  </p>
                )}
              </Card>
            </div>
          )}

          {game.status === 'collecting' && (
            <div className="max-w-4xl mx-auto">
              <Card className="p-12 text-center">
                <h2 className="text-4xl font-bold mb-4">
                  Players are submitting...
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  {submissions.length} / {players.length * (game.settings.max_submissions_per_player || 1)} submissions received
                </p>
                <div className="flex items-center justify-center gap-4 mb-8">
                  {players.map((player) => {
                    const playerSubmissions = submissions.filter(
                      (s) => s.player_id === player.id
                    );
                    return (
                      <div key={player.id} className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2">
                          {playerSubmissions.length > 0 ? (
                            <CheckCircle className="w-8 h-8" />
                          ) : (
                            player.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <p className="text-sm font-medium">{player.name}</p>
                      </div>
                    );
                  })}
                </div>
                <Button
                  size="lg"
                  className="text-xl px-12 py-6"
                  onClick={handleStartRevealing}
                  disabled={submissions.length === 0}
                >
                  <Eye className="w-6 h-6 mr-2" />
                  Start Revealing
                </Button>
              </Card>
            </div>
          )}

          {game.status === 'revealing' && (
            <div className="max-w-4xl mx-auto">
              <Card className="p-12 text-center">
                <h2 className="text-4xl font-bold mb-8">Reveal Mode</h2>
                <p className="text-xl text-gray-600">
                  Reveal implementation coming next...
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet View - Host Control Panel */}
      <div className="lg:hidden">
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">{game.name}</h1>
            <Tabs defaultValue="join" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="join">Join</TabsTrigger>
                <TabsTrigger value="players">Players</TabsTrigger>
                <TabsTrigger value="control">Control</TabsTrigger>
              </TabsList>
              <TabsContent value="join" className="space-y-4">
                <div className="text-center">
                  <div className="bg-white p-4 rounded-xl inline-block mb-4">
                    <QRCode value={joinUrl} size={200} />
                  </div>
                  <div>
                    <p className="text-gray-600 mb-2">Game Code:</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-bold">{game.code}</span>
                      <Button size="icon" variant="ghost" onClick={copyCode}>
                        {codeCopied ? <Check /> : <Copy />}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="players" className="space-y-3">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{player.name}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="control" className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Status:</p>
                  <Badge>{game.status.toUpperCase()}</Badge>
                </div>
                {game.status === 'setup' && (
                  <Button
                    className="w-full"
                    onClick={handleStartCollecting}
                    disabled={players.length < 2}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Game
                  </Button>
                )}
                {game.status === 'collecting' && (
                  <>
                    <p className="text-sm">
                      Submissions: {submissions.length} / {players.length}
                    </p>
                    <Button className="w-full" onClick={handleStartRevealing}>
                      <Eye className="w-4 h-4 mr-2" />
                      Start Revealing
                    </Button>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
