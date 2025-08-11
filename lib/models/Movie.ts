import mongoose from 'mongoose';

export interface Movie {
  _id: string;
  title: string;
  image: string;
  year?: string;
  suggestedBy: string;
  createdAt: string;
}

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: false
  },
  suggestedBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Movie || mongoose.model('Movie', movieSchema); 