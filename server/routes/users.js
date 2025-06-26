import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { preferences: req.body.preferences },
      { new: true }
    );
    res.json(user.preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Save book to user's list
router.post('/books/save/:bookId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.savedBooks.includes(req.params.bookId)) {
      user.savedBooks.push(req.params.bookId);
      await user.save();
    }
    res.json(user.savedBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add book to reading list
router.post('/books/reading/:bookId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const bookInList = user.readingList.find(item => 
      item.book.toString() === req.params.bookId
    );
    
    if (!bookInList) {
      user.readingList.push({ book: req.params.bookId });
      await user.save();
    }
    res.json(user.readingList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update reading progress
router.put('/books/reading/:bookId/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const bookItem = user.readingList.find(item => 
      item.book.toString() === req.params.bookId
    );
    
    if (bookItem) {
      bookItem.progress = req.body.progress;
      bookItem.lastRead = new Date();
      await user.save();
    }
    
    res.json(bookItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const userRoutes = router;