import { NextRequest, NextResponse } from 'next/server';

// Search movies using external API (OMDb or TMDb)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const apiKey = process.env.MOVIE_API_KEY;
    const provider = process.env.MOVIE_API_PROVIDER || 'omdb';

    if (!apiKey) {
      return NextResponse.json({ error: 'Movie API key not configured' }, { status: 500 });
    }

    let movieData;
    
    if (provider === 'omdb') {
      // OMDb API
      const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${apiKey}`);
      const data = await response.json();
      
      if (data.Response === 'True') {
        movieData = {
          title: data.Title,
          image: data.Poster !== 'N/A' ? data.Poster : null,
          year: data.Year
        };
      }
    } else {
      // TMDb API
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const movie = data.results[0];
        movieData = {
          title: movie.title,
          image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
          year: movie.release_date ? movie.release_date.split('-')[0] : null
        };
      }
    }

    if (!movieData) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json(movieData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search movie' }, { status: 500 });
  }
}