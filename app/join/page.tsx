'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

export default function JoinPage() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState('');

  const handleSubmit = () => {
    const code = gameCode.trim().toUpperCase();
    if (code) {
      router.push(`/join/${code}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50 px-4">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🦃</div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Join a Game
          </h1>
          <p className="text-gray-600">
            Enter the 6-digit game code to join
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gameCode" className="text-base">
              Game Code
            </Label>
            <Input
              id="gameCode"
              type="text"
              placeholder="e.g., ABC123"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
              className="text-2xl text-center font-bold tracking-wider py-6"
              maxLength={6}
              autoFocus
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={gameCode.trim().length !== 6}
            className="w-full text-lg py-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            Continue
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => router.push('/')}
              className="text-gray-600"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
