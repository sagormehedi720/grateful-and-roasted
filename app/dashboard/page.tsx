'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Game, GameMode } from '@/types/database';
import { Plus, Play, Users, Calendar, Trophy } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [gameName, setGameName] = useState('');
  const [gameMode, setGameMode] = useState<GameMode>('both');

  useEffect(() => {
    if (isLoaded && user) {
      fetchGames();
    }
  }, [isLoaded, user]);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      if (response.ok) {
        const data = await response.json();
        setGames(data.games || []);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = async () => {
    if (!gameName.trim()) {
      alert('Please enter a game name');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: gameName,
          game_mode: gameMode,
          settings: {
            allow_anonymous: true,
            require_target_for_roast: true,
            enable_voting: true,
            voting_time_limit: 60,
            reveal_authors_after_voting: true,
            max_submissions_per_player: 5,
            enable_reactions: true,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCreateDialogOpen(false);
        setGameName('');
        setGameMode('both');
        router.push(`/game/${data.game.id}`);
      } else {
        alert('Failed to create game');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Failed to create game');
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      setup: { label: 'Setup', className: 'bg-gray-100 text-gray-700' },
      collecting: { label: 'Collecting', className: 'bg-blue-100 text-blue-700' },
      revealing: { label: 'Revealing', className: 'bg-purple-100 text-purple-700' },
      voting: { label: 'Voting', className: 'bg-yellow-100 text-yellow-700' },
      completed: { label: 'Completed', className: 'bg-green-100 text-green-700' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.setup;

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getGameModeLabel = (mode: GameMode) => {
    const labels = {
      gratitude: '❤️ Gratitude',
      roast: '🔥 Roast',
      both: '❤️🔥 Both',
    };
    return labels[mode] || mode;
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🦃</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦃</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Grateful & Roasted
            </h1>
          </div>
          <Button variant="outline" onClick={() => router.push('/')}>
            Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Games</h1>
          <p className="text-gray-600">
            Create and manage your Thanksgiving games
          </p>
        </div>

        {/* Create Game Button */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="mb-6">
              <Plus className="w-5 h-5 mr-2" />
              Create New Game
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Game</DialogTitle>
              <DialogDescription>
                Set up your Thanksgiving game. You can customize more settings later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Game Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Smith Family Thanksgiving 2024"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mode">Game Mode</Label>
                <Select
                  value={gameMode}
                  onValueChange={(value) => setGameMode(value as GameMode)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select game mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gratitude">❤️ Gratitude Only</SelectItem>
                    <SelectItem value="roast">🔥 Roast Only</SelectItem>
                    <SelectItem value="both">❤️🔥 Both (Recommended)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  {gameMode === 'gratitude' && 'Share what you\'re thankful for'}
                  {gameMode === 'roast' && 'Playfully roast family members'}
                  {gameMode === 'both' && 'Mix heartfelt moments with playful roasts'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateGame}
                disabled={creating || !gameName.trim()}
                className="flex-1"
              >
                {creating ? 'Creating...' : 'Create Game'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Games Grid */}
        {games.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🦃</div>
            <h3 className="text-xl font-semibold mb-2">No games yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first Thanksgiving game to get started!
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Game
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card
                key={game.id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/game/${game.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                      {game.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(game.status)}
                      <Badge variant="outline">
                        {getGameModeLabel(game.game_mode)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(game.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    <span>Code: {game.code}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button className="w-full" variant="outline">
                    <Play className="w-4 h-4 mr-2" />
                    {game.status === 'setup' ? 'Start Game' : 'Continue'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
