import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Movie from '@/lib/models/Movie';

// GET /api/movies - Get all movies
export async function GET() {
  try {
    await dbConnect();
    const movies = await Movie.find({}).sort({ createdAt: -1 });
    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}

// POST /api/movies - Add a new movie
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, image, year } = body;

    if (!title || !image) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }

    await dbConnect();
    const movie = new Movie({
      title,
      image,
      year,
      suggestedBy: session.user.email || session.user.name
    });

    await movie.save();
    return NextResponse.json(movie, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create movie' }, { status: 500 });
  }
}