'use client';

import { useState } from 'react';

export default function AddMovieForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const searchMovie = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/movies/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (response.ok) {
        setSearchResults(data);
      } else {
        alert(data.error || 'Failed to search movie');
      }
    } catch (error) {
      console.error('Error searching movie:', error);
      alert('Failed to search movie');
    } finally {
      setIsSearching(false);
    }
  };

  const addMovie = async () => {
    if (!searchResults) return;
    
    setIsAdding(true);
    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: searchResults.title,
          image: searchResults.image,
          year: searchResults.year,
        }),
      });
      
      if (response.ok) {
        setSearchQuery('');
        setSearchResults(null);
        // Trigger page refresh to show new movie
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add movie');
      }
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Failed to add movie');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">Add a Movie</h2>
      
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter movie title..."
          className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 border border-gray-400 focus:outline-none focus:border-blue-400"
          onKeyPress={(e) => e.key === 'Enter' && searchMovie()}
        />
        <button
          onClick={searchMovie}
          disabled={isSearching || !searchQuery.trim()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {searchResults && (
        <div className="bg-white bg-opacity-20 rounded-lg p-4">
          <div className="flex items-center gap-4">
            {searchResults.image && (
              <img
                src={searchResults.image}
                alt={searchResults.title}
                className="w-16 h-24 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-movie.svg';
                }}
              />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{searchResults.title}</h3>
              {searchResults.year && (
                <p className="text-gray-300">{searchResults.year}</p>
              )}
            </div>
            <button
              onClick={addMovie}
              disabled={isAdding}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors"
            >
              {isAdding ? 'Adding...' : 'Add Movie'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}