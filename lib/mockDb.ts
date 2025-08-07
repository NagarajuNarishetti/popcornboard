import { Movie } from '@/types';

// Mock database for development
let movies: Movie[] = [
  {
    _id: '1',
    title: 'Inception',
    image: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    year: '2010',
    suggestedBy: 'user@example.com',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'The Matrix',
    image: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
    year: '1999',
    suggestedBy: 'user@example.com',
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: 'Interstellar',
    image: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
    year: '2014',
    suggestedBy: 'user@example.com',
    createdAt: new Date().toISOString()
  }
];

export const getMockMovies = () => {
  return [...movies];
};

export const addMockMovie = (movie: Omit<Movie, '_id' | 'createdAt'>) => {
  const newMovie = {
    ...movie,
    _id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString()
  };
  movies.push(newMovie);
  return newMovie;
};

export const deleteMockMovie = (id: string) => {
  const index = movies.findIndex(movie => movie._id === id);
  if (index === -1) return false;
  movies.splice(index, 1);
  return true;
};