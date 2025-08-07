// // 'use client';

// // import { useEffect, useState } from 'react';
// // import { useSession } from 'next-auth/react';
// // import MovieCard from './MovieCard';

// // interface Movie {
// //   _id: string;
// //   title: string;
// //   image: string;
// //   year?: string;
// //   suggestedBy: string;
// //   createdAt: string;
// // }

// // export default function MovieGrid() {
// //   const [movies, setMovies] = useState<Movie[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const { status } = useSession();

// //   useEffect(() => {
// //     fetchMovies();
// //   }, [status]); // Refetch when session status changes

// //   const fetchMovies = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await fetch('/api/movies');
// //       const data = await response.json();
// //       setMovies(data);
// //     } catch (error) {
// //       console.error('Failed to fetch movies:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center py-12">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
// //       </div>
// //     );
// //   }

// //   if (movies.length === 0) {
// //     return (
// //       <div className="text-center py-12">
// //         <p className="text-gray-300 text-xl">No movies suggested yet. Be the first to add one!</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
// //       {movies.map((movie) => (
// //         <MovieCard key={movie._id} movie={movie} onUpdate={fetchMovies} />
// //       ))}
// //     </div>
// //   );
// // } 


// 'use client';

// import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import MovieCard from './MovieCard';

// interface Movie {
//   _id: string;
//   title: string;
//   image: string;
//   year?: string;
//   suggestedBy: string;
//   createdAt: string;
// }

// export default function MovieGrid() {
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { status } = useSession();

//   useEffect(() => {
//     fetchMovies();
//   }, [status]); // Refetch when session status changes

//   const fetchMovies = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/movies');
//       const data = await response.json();

//       // ✅ Ensure we extract the array properly
//       const movieArray = Array.isArray(data) ? data : data.movies;
//       if (Array.isArray(movieArray)) {
//         setMovies(movieArray);
//       } else {
//         console.error("Invalid movie data:", data);
//         setMovies([]); // fallback
//       }
//     } catch (error) {
//       console.error('Failed to fetch movies:', error);
//       setMovies([]); // fallback
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
//       </div>
//     );
//   }

//   if (movies.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-gray-300 text-xl">No movies suggested yet. Be the first to add one!</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
//       {movies.map((movie) => (
//         <MovieCard key={movie._id} movie={movie} onUpdate={fetchMovies} />
//       ))}
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import MovieCard from './MovieCard';

interface Movie {
  _id: string;
  title: string;
  image: string;
  year?: string;
  suggestedBy: string;
  createdAt: string;
}

export default function MovieGrid() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { status } = useSession();

  useEffect(() => {
    fetchMovies();
  }, [status]); // Refetch when session status changes

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/movies');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-300 text-xl">No movies suggested yet. Be the first to add one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} onUpdate={fetchMovies} />
      ))}
    </div>
  );
} 