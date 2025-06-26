import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  genres: [{
    type: String,
    required: true
  }],
  publicationYear: {
    type: Number,
    required: true
  },
  publisher: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Book = mongoose.model('Book', bookSchema);