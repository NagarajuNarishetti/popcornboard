import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Movie from '@/lib/models/Movie';

// DELETE /api/movies/[id] - Delete a movie
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const movie = await Movie.findById(id);

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    // More robust permission check that handles different user identifier formats
    const userEmail = session.user.email;
    const userName = session.user.name;
    const suggestedBy = movie.suggestedBy;

    const canDelete = (() => {
      // Check if user email matches suggestedBy
      if (userEmail && userEmail === suggestedBy) return true;

      // Check if user name matches suggestedBy
      if (userName && userName === suggestedBy) return true;

      // Check if user email without domain matches suggestedBy (for development login)
      if (userEmail && userEmail.split('@')[0] === suggestedBy) return true;

      return false;
    })();

    if (!canDelete) {
      return NextResponse.json({
        error: 'Forbidden - You can only delete movies you suggested',
        userEmail,
        userName,
        suggestedBy
      }, { status: 403 });
    }

    await Movie.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json({ error: 'Failed to delete movie' }, { status: 500 });
  }
}