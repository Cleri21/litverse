// User profile management for the Book Recommendation System
import { updateSavedBooksList, updateReadingHistory } from './main.js';

export function initUserProfile() {
  // Initialize the user profile
  console.log('Initializing user profile');
  
  // Load user data from localStorage
  loadUserData();
  
  // Set up profile event listeners
  setupProfileListeners();
}

// Load user data from localStorage
function loadUserData() {
  // Load saved books
  const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');
  document.getElementById('books-saved').textContent = savedBooks.length;
  
  // Load reading list
  const readingList = JSON.parse(localStorage.getItem('readingList') || '[]');
  document.getElementById('books-read').textContent = readingList.length;
  
  // Load user preferences
  const userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '[]');
  
  // Load user name if set
  const userName = localStorage.getItem('userName') || 'Reader';
  document.getElementById('profile-name').textContent = userName;
  
  // Update UI elements
  updateSavedBooksList();
  updateReadingHistory();
}

// Set up profile event listeners
function setupProfileListeners() {
  // Editable profile name
  const profileName = document.getElementById('profile-name');
  
  profileName.addEventListener('click', () => {
    const currentName = profileName.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'profile-name-input';
    
    input.addEventListener('blur', () => {
      const newName = input.value.trim();
      if (newName && newName !== currentName) {
        localStorage.setItem('userName', newName);
      }
      
      profileName.textContent = newName || currentName;
    });
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
    
    profileName.textContent = '';
    profileName.appendChild(input);
    input.focus();
    input.select();
  });
}

// Add a book to the user's saved books
export function saveBook(book) {
  // Get current saved books
  const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');
  
  // Check if book is already saved
  if (!savedBooks.some(b => b.id === book.id)) {
    // Add the book
    savedBooks.push(book);
    
    // Save to localStorage
    localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
    
    // Update UI
    document.getElementById('books-saved').textContent = savedBooks.length;
    updateSavedBooksList();
    
    return true;
  }
  
  return false;
}

// Remove a book from saved books
export function removeSavedBook(bookId) {
  // Get current saved books
  const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');
  
  // Filter out the book
  const updatedBooks = savedBooks.filter(book => book.id !== bookId);
  
  // If a book was removed
  if (updatedBooks.length < savedBooks.length) {
    // Save to localStorage
    localStorage.setItem('savedBooks', JSON.stringify(updatedBooks));
    
    // Update UI
    document.getElementById('books-saved').textContent = updatedBooks.length;
    updateSavedBooksList();
    
    return true;
  }
  
  return false;
}

// Add a book to the reading list
export function addToReadingList(book) {
  // Get current reading list
  const readingList = JSON.parse(localStorage.getItem('readingList') || '[]');
  
  // Check if book is already in the list
  if (!readingList.some(b => b.id === book.id)) {
    // Add the book with timestamp and initial progress
    const bookWithProgress = {
      ...book,
      startedAt: new Date().toISOString(),
      progress: 0,
      lastRead: new Date().toISOString()
    };
    
    readingList.push(bookWithProgress);
    
    // Save to localStorage
    localStorage.setItem('readingList', JSON.stringify(readingList));
    
    // Update UI
    document.getElementById('books-read').textContent = readingList.length;
    updateReadingHistory();
    
    return true;
  }
  
  return false;
}

// Update reading progress for a book
export function updateReadingProgress(bookId, progress) {
  // Get current reading list
  const readingList = JSON.parse(localStorage.getItem('readingList') || '[]');
  
  // Find the book
  const updatedList = readingList.map(book => {
    if (book.id === bookId) {
      return {
        ...book,
        progress: Math.min(100, Math.max(0, progress)),
        lastRead: new Date().toISOString()
      };
    }
    return book;
  });
  
  // Save to localStorage
  localStorage.setItem('readingList', JSON.stringify(updatedList));
  
  // Update UI
  updateReadingHistory();
  
  // If progress is 100%, trigger completed book event
  const completedBook = updatedList.find(book => book.id === bookId && book.progress === 100);
  
  if (completedBook) {
    const bookCompletedEvent = new CustomEvent('bookCompleted', {
      detail: { book: completedBook }
    });
    document.dispatchEvent(bookCompletedEvent);
    
    // Create a notification
    const notification = {
      title: 'Book Completed',
      message: `Congratulations! You've finished reading "${completedBook.title}".`,
      time: new Date().toISOString()
    };
    
    document.dispatchEvent(new CustomEvent('newNotification', { 
      detail: notification 
    }));
  }
}

// Get all user preferences
export function getUserPreferences() {
  return JSON.parse(localStorage.getItem('userPreferences') || '[]');
}

// Update user preferences
export function updateUserPreferences(preferences) {
  localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

// Get user's reading history
export function getReadingHistory() {
  return JSON.parse(localStorage.getItem('readingList') || '[]');
}

// Get user's saved books
export function getSavedBooks() {
  return JSON.parse(localStorage.getItem('savedBooks') || '[]');
}

// Get user's name
export function getUserName() {
  return localStorage.getItem('userName') || 'Reader';
}

// Set user's name
export function setUserName(name) {
  localStorage.setItem('userName', name);
  document.getElementById('profile-name').textContent = name;
}