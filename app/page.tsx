'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Heart, Flame, Users, Sparkles, Trophy, QrCode } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: <Heart className="w-6 h-6 text-orange-600" />,
      title: 'Heartfelt Gratitude',
      description: 'Share what you\'re truly thankful for this year',
    },
    {
      icon: <Flame className="w-6 h-6 text-red-600" />,
      title: 'Playful Roasts',
      description: 'Lovingly roast your family members (anonymously!)',
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: 'Family Fun',
      description: 'Perfect for 4-20 people, all ages welcome',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
      title: 'Anonymous Reveals',
      description: 'Watch the drama unfold as submissions are revealed',
    },
    {
      icon: <Trophy className="w-6 h-6 text-yellow-600" />,
      title: 'Voting & Scoring',
      description: 'Guess who wrote what and earn points',
    },
    {
      icon: <QrCode className="w-6 h-6 text-green-600" />,
      title: 'Easy Join',
      description: 'Scan QR code to join - no app download needed',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Host Creates Game',
      description: 'Start a new game and choose your mode: Gratitude, Roast, or Both!',
    },
    {
      step: '2',
      title: 'Players Join',
      description: 'Everyone scans the QR code on their phones to join the game',
    },
    {
      step: '3',
      title: 'Submit Anonymously',
      description: 'Write heartfelt gratitudes or cheeky roasts - completely anonymous',
    },
    {
      step: '4',
      title: 'Reveal & Vote',
      description: 'Watch submissions appear on the big screen and vote who wrote what',
    },
    {
      step: '5',
      title: 'Crown the Winner',
      description: 'Most correct guesses wins! Share laughs and memories together',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦃</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Grateful & Roasted
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <Button onClick={() => router.push('/dashboard')}>
                Create Game - Free
              </Button>
            </SignedOut>
            <SignedIn>
              <Button onClick={() => router.push('/dashboard')} variant="default">
                Dashboard
              </Button>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
            🎉 10,000+ families played last Thanksgiving
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            The Thanksgiving Game That'll Make You{' '}
            <span className="text-orange-600">Laugh</span>,{' '}
            <span className="text-blue-600">Cry</span>, and{' '}
            <span className="text-red-600">Question Who Wrote THAT</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl">
            Turn your Thanksgiving gathering into an unforgettable experience with
            heartfelt gratitudes and hilarious anonymous roasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              onClick={() => router.push('/dashboard')}
            >
              Create Your Family Game - Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => router.push('/join')}
            >
              Join a Game
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            No app download required • Works on any device • 100% free forever
          </p>
        </div>

        {/* Hero Image/Animation Placeholder */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 p-8 md:p-12 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl p-8 flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <div className="text-6xl mb-4">🦃 ❤️ 🔥</div>
              <p className="text-gray-600 text-lg">
                Interactive game demo preview coming soon!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for an Epic Thanksgiving
          </h2>
          <p className="text-xl text-gray-600">
            Designed for maximum fun and minimum setup
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            From setup to celebration in 5 easy steps
          </p>
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          {howItWorks.map((item, index) => (
            <Card key={index} className="p-6 flex items-start gap-6 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Unforgettable Memories?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of families making Thanksgiving more meaningful and fun
          </p>
          <Button
            size="lg"
            className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-6"
            onClick={() => router.push('/dashboard')}
          >
            Start Your Free Game Now
          </Button>
          <p className="mt-4 text-sm opacity-75">
            No credit card required • No app download • No hidden fees
          </p>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="text-center text-gray-600">
          <p className="mb-2">Made with ❤️ for families everywhere</p>
          <p className="text-sm">© 2024 Grateful & Roasted. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
