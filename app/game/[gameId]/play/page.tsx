'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Game, Player, Submission } from '@/types/database';
import { supabase } from '@/lib/supabase';
import { playSound } from '@/lib/sounds';
import { Heart, Flame, Send, CheckCircle, Eye, Loader2 } from 'lucide-react';

export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params?.gameId as string;

  const [game, setGame] = useState<Game | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [submissionType, setSubmissionType] = useState<'gratitude' | 'roast'>('gratitude');
  const [content, setContent] = useState('');
  const [targetPlayerId, setTargetPlayerId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Verify player session
    const sessionId = localStorage.getItem('grateful_roasted_session');
    const storedPlayerId = localStorage.getItem('grateful_roasted_player_id');
    const storedGameId = localStorage.getItem('grateful_roasted_game_id');

    if (!sessionId || !storedPlayerId || storedGameId !== gameId) {
      // Redirect to join page
      router.push(`/join`);
      return;
    }

    fetchGameData(storedPlayerId);
    setupRealtimeSubscriptions();

    return () => {
      supabase.channel(`game:${gameId}:player`).unsubscribe();
    };
  }, [gameId, router]);

  const fetchGameData = async (playerId: string) => {
    try {
      // Fetch game
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (gameError) throw gameError;
      setGame(gameData);

      // Fetch current player
      const { data: playerData, error: playerError } = await supabase
        .from('players')
        .select('*')
        .eq('id', playerId)
        .single();

      if (playerError) throw playerError;
      setPlayer(playerData);

      // Fetch all players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .eq('game_id', gameId)
        .order('joined_at', { ascending: true });

      if (playersError) throw playersError;
      setPlayers(playersData || []);

      // Fetch player's submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('game_id', gameId)
        .eq('player_id', playerId);

      if (submissionsError) throw submissionsError;
      setSubmissions(submissionsData || []);

      // Set default submission type based on game mode
      if (gameData.game_mode === 'roast') {
        setSubmissionType('roast');
      } else if (gameData.game_mode === 'gratitude') {
        setSubmissionType('gratitude');
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
      router.push('/join');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const channel = supabase.channel(`game:${gameId}:player`);

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
        const playerId = localStorage.getItem('grateful_roasted_player_id');
        if (playerId) fetchGameData(playerId);
      }
    );

    channel.subscribe();
  };

  const handleSubmit = async () => {
    if (!content.trim() || !player || !game) return;

    if (submissionType === 'roast' && !targetPlayerId) {
      playSound('error', 0.3);
      alert('Please select who you want to roast');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('submissions').insert({
        game_id: gameId,
        player_id: player.id,
        round: game.current_round,
        type: submissionType,
        content: content.trim(),
        target_player_id: submissionType === 'roast' ? targetPlayerId : null,
      });

      if (error) throw error;

      // Success sound!
      playSound('success', 0.4);

      // Clear form
      setContent('');
      setTargetPlayerId('');

      // Refresh submissions
      const playerId = localStorage.getItem('grateful_roasted_player_id');
      if (playerId) fetchGameData(playerId);
    } catch (error) {
      console.error('Error submitting:', error);
      playSound('error', 0.3);
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmitMore = () => {
    if (!game) return false;
    const maxSubmissions = game.settings.max_submissions_per_player || 1;
    return submissions.length < maxSubmissions;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!game || !player) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50">
        <Card className="p-8 text-center">
          <p className="text-gray-600">Game not found</p>
          <Button onClick={() => router.push('/join')} className="mt-4">
            Join a Game
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 pb-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{game.name}</h1>
              <p className="text-sm text-gray-600">Hey, {player.name}! 👋</p>
            </div>
            <Badge className="text-base px-3 py-1">
              {game.status === 'setup' && 'Waiting...'}
              {game.status === 'collecting' && 'Submit Now!'}
              {game.status === 'revealing' && 'Watch the Screen'}
              {game.status === 'voting' && 'Vote!'}
              {game.status === 'completed' && 'Completed'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {game.status === 'setup' && (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold mb-2">Waiting to Start</h2>
            <p className="text-gray-600 mb-4">
              The host will start the game soon. Get ready to share your thoughts!
            </p>
            <Badge variant="outline" className="text-base px-4 py-2">
              {players.length} Players Joined
            </Badge>
          </Card>
        )}

        {game.status === 'collecting' && (
          <div className="space-y-6">
            {/* Submission Form */}
            {canSubmitMore() ? (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Share Your Thoughts</h2>

                {/* Type Selection (if game mode is 'both') */}
                {game.game_mode === 'both' && (
                  <div className="flex gap-3 mb-6">
                    <Button
                      variant={submissionType === 'gratitude' ? 'default' : 'outline'}
                      onClick={() => setSubmissionType('gratitude')}
                      className="flex-1"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Gratitude
                    </Button>
                    <Button
                      variant={submissionType === 'roast' ? 'default' : 'outline'}
                      onClick={() => setSubmissionType('roast')}
                      className="flex-1"
                    >
                      <Flame className="w-4 h-4 mr-2" />
                      Roast
                    </Button>
                  </div>
                )}

                {/* Target Selection (for roasts) */}
                {submissionType === 'roast' && (
                  <div className="mb-4">
                    <Label>Who are you roasting?</Label>
                    <Select value={targetPlayerId} onValueChange={setTargetPlayerId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a player" />
                      </SelectTrigger>
                      <SelectContent>
                        {players
                          .filter((p) => p.id !== player.id)
                          .map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Content Input */}
                <div className="mb-4">
                  <Label>
                    {submissionType === 'gratitude'
                      ? "What are you grateful for?"
                      : "What's your playful roast?"}
                  </Label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      submissionType === 'gratitude'
                        ? "I'm thankful for..."
                        : "Roast someone (keep it light and fun!)"
                    }
                    className="mt-2 min-h-[120px] text-base"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {content.length}/500 characters
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={
                    submitting ||
                    !content.trim() ||
                    (submissionType === 'roast' && !targetPlayerId)
                  }
                  className="w-full"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Anonymously
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-3">
                  Your submission is completely anonymous!
                </p>
              </Card>
            ) : (
              <Card className="p-8 text-center bg-green-50 border-green-200">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Submission Complete!</h3>
                <p className="text-gray-600">
                  You've submitted {submissions.length} response{submissions.length !== 1 ? 's' : ''}.
                  Watch the screen for reveals!
                </p>
              </Card>
            )}

            {/* Your Submissions (Hidden Preview) */}
            {submissions.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Your Submissions ({submissions.length})
                </h3>
                <div className="space-y-3">
                  {submissions.map((sub, index) => (
                    <div
                      key={sub.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {sub.type === 'gratitude' ? (
                          <Heart className="w-4 h-4 text-orange-600" />
                        ) : (
                          <Flame className="w-4 h-4 text-red-600" />
                        )}
                        <Badge variant="outline" className="text-xs">
                          {sub.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{sub.content}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {(game.status === 'revealing' || game.status === 'voting') && (
          <Card className="p-8 text-center">
            <Eye className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Watch the Big Screen!</h2>
            <p className="text-gray-600">
              Submissions are being revealed. Get ready to guess who wrote what!
            </p>
          </Card>
        )}

        {game.status === 'completed' && (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
            <p className="text-gray-600 mb-4">
              Thanks for playing! Check the screen for final results.
            </p>
            <Button onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
