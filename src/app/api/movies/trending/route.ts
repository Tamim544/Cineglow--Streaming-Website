import { NextResponse } from 'next/server';
import { getTrendingMovies } from '@/lib/tmdb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    // In a real environment, we check if API key exists. If not, mock for demo.
    if (!process.env.TMDB_API_KEY || process.env.TMDB_API_KEY === 'your_tmdb_api_key_here') {
      return NextResponse.json({
        page: 1,
        results: [
          {
            id: 1,
            title: "Mock Data (API Key Missing)",
            poster_path: null,
            vote_average: 0,
            release_date: "2024-01-01"
          }
        ]
      });
    }

    const data = await getTrendingMovies(page);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch trending movies' },
      { status: 500 }
    );
  }
}
