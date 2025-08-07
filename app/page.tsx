import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import MovieGrid from '@/components/MovieGrid';
import Header from '@/components/Header';
import AddMovieForm from '@/components/AddMovieForm';

export default async function Home() {
  // Force revalidation on each request by reading headers
  // This ensures we don't use cached session data
  headers();
  
  // Get the current session with cache disabled
  const session = await getServerSession();

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header session={session} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🍿 PopcornBoard
          </h1>
          <p className="text-xl text-gray-300">
            Discover and share amazing movies with the community
          </p>
        </div>

        {session && (
          <div className="mb-8">
            <AddMovieForm />
          </div>
        )}

        <MovieGrid />
      </div>
    </main>
  );
}