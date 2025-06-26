import express from 'express';
import { Book } from '../models/Book.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get books by genre
router.get('/genre/:genre', async (req, res) => {
  try {
    const books = await Book.find({ genres: req.params.genre });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const bookRoutes = router;