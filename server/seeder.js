import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Book } from './models/Book.js';
import { books } from '../js/data.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing books
    await Book.deleteMany();
    console.log('Cleared existing books');

    // Insert new books
    await Book.insertMany(books);
    console.log('Database seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();