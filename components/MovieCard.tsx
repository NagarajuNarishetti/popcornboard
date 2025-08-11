'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface Movie {
  _id: string;
  title: string;
  image: string;
  year?: string;
  suggestedBy: string;
  createdAt: string;
}

interface MovieCardProps {
  movie: Movie;
  onUpdate: () => void;
}

export default function MovieCard({ movie, onUpdate }: MovieCardProps) {
  const { data: session, status } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  // More robust canDelete logic that handles different user identifier formats
  const canDelete = (() => {
    if (!session?.user) return false;
    
    const userEmail = session.user.email;
    const userName = session.user.name;
    const suggestedBy = movie.suggestedBy;
    
    // Check if user email matches suggestedBy
    if (userEmail && userEmail === suggestedBy) return true;
    
    // Check if user name matches suggestedBy
    if (userName && userName === suggestedBy) return true;
    
    // Check if user email without domain matches suggestedBy (for development login)
    if (userEmail && userEmail.split('@')[0] === suggestedBy) return true;
    
    return false;
  })();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this movie?')) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/movies/${movie._id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onUpdate();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete movie: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      alert('Failed to delete movie');
    } finally {
      setIsDeleting(false);
    }
  };

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
        <div className="relative h-64">
          <div className="w-full h-full bg-gray-700 animate-pulse"></div>
        </div>
        <div className="p-4">
          <div className="h-6 bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="relative h-64">
        <Image
          src={movie.image || '/placeholder-movie.svg'}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => {
            // This is handled by next/image, but we'll add a fallback just in case
            const imgElement = document.querySelector(`[alt="${movie.title}"]`) as HTMLImageElement;
            if (imgElement) imgElement.src = '/placeholder-movie.svg';
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {movie.title}
        </h3>
        
        {movie.year && (
          <p className="text-gray-300 text-sm mb-2">
            Released: {movie.year}
          </p>
        )}
        
        <p className="text-gray-400 text-sm mb-3">
          Suggested by: {movie.suggestedBy}
        </p>
        
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white py-2 px-4 rounded transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  );
}