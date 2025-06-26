import express from 'express';
import mongoose from 'mongoose';
import { Book } from '../models/Book.js';
import { User } from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get personalized recommendations
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Get books matching user preferences
    const recommendations = await Book.find({
      genres: { $in: user.preferences },
      _id: { $nin: user.readingList.map(item => item.book) }
    })
    .sort({ rating: -1 })
    .limit(8);
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get trending books
router.get('/trending', async (req, res) => {
  try {
    const trendingBooks = await Book.find({ rating: { $gte: 4.3 } })
      .sort({ rating: -1 })
      .limit(8);
    
    res.json(trendingBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get similar books
router.get('/similar/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    const similarBooks = await Book.find({
      _id: { $ne: book._id },
      genres: { $in: book.genres }
    })
    .sort({ rating: -1 })
    .limit(4);
    
    res.json(similarBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const recommendationRoutes = router;