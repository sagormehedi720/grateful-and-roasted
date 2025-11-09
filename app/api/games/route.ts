import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { GameMode, GameSettings } from '@/types/database';

// Force dynamic - API routes should not be static
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, game_mode, settings } = body as {
      name: string;
      game_mode: GameMode;
      settings?: GameSettings;
    };

    if (!name || !game_mode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create game
    const { data: game, error: gameError } = await supabase
      .from('games')
      .insert({
        host_id: userId,
        name,
        game_mode,
        status: 'setup',
        settings: settings || {},
      })
      .select()
      .single();

    if (gameError) {
      console.error('Error creating game:', gameError);
      return NextResponse.json(
        { error: 'Failed to create game' },
        { status: 500 }
      );
    }

    // Create host as a player
    const { error: playerError } = await supabase
      .from('players')
      .insert({
        game_id: game.id,
        name: 'Host',
        is_host: true,
      });

    if (playerError) {
      console.error('Error creating host player:', playerError);
    }

    return NextResponse.json({ game }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/games:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: games, error } = await supabase
      .from('games')
      .select('*')
      .eq('host_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching games:', error);
      return NextResponse.json(
        { error: 'Failed to fetch games' },
        { status: 500 }
      );
    }

    return NextResponse.json({ games }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/games:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
