import { NextResponse } from 'next/server';
import { searchMulti } from '@/lib/tmdb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    
    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const data = await searchMulti(query, 1);
    const filteredResults = (data.results || []).filter(
      (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
    );

    return NextResponse.json({ ...data, results: filteredResults });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search media' },
      { status: 500 }
    );
  }
}

