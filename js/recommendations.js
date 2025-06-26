// Recommendations engine for the Book Recommendation System
import { books } from './data.js';
import { createBookCard } from './main.js';

export function initRecommendations() {
  // Initialize the recommendation system
  console.log('Initializing recommendation engine');
  
  // Set up recommendation refresh timer (would connect to a real API in production)
  setInterval(refreshRecommendations, 1000 * 60 * 60); // Refresh every hour
}

// Refresh recommendations - in a real app this would use machine learning algorithms
function refreshRecommendations() {
  const userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '[]');
  const readingHistory = JSON.parse(localStorage.getItem('readingList') || '[]');
  
  if (userPreferences.length === 0) return;
  
  // Update recommendations section if it's visible
  const recommendationsSection = document.getElementById('recommendations-section');
  if (recommendationsSection && !recommendationsSection.classList.contains('hidden')) {
    updateRecommendations(userPreferences, readingHistory);
  }
}

// Update recommendations based on user preferences and reading history
function updateRecommendations(preferences, readingHistory) {
  const recommendationsContainer = document.getElementById('recommendations-container');
  if (!recommendationsContainer) return;
  
  // Clear current recommendations
  recommendationsContainer.innerHTML = '';
  
  // Get personalized recommendations
  const recommendedBooks = getPersonalizedRecommendations(preferences, readingHistory);
  
  // Add recommendations to container
  recommendedBooks.forEach(book => {
    const bookCard = createBookCard(book);
    recommendationsContainer.appendChild(bookCard);
  });
  
  // Add animation
  document.querySelectorAll('#recommendations-container .book-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('animate-slide-up');
  });
  
  // Create notification if there are new recommendations
  if (Math.random() > 0.7) { // Simulating occasional new recommendations
    const notification = {
      title: 'New Recommendations',
      message: 'We\'ve updated your recommendations based on your preferences.',
      time: new Date().toISOString()
    };
    
    document.dispatchEvent(new CustomEvent('newNotification', { detail: notification }));
  }
}

// Get personalized recommendations based on user preferences and reading history
function getPersonalizedRecommendations(preferences, readingHistory) {
  // In a real app, this would use sophisticated algorithms
  // For this demo, we'll use a simple weighting system
  
  // Filter out books the user has already read
  const readBookIds = readingHistory.map(book => book.id);
  const unreadBooks = books.filter(book => !readBookIds.includes(book.id));
  
  // Score each book based on preferences and reading history
  const scoredBooks = unreadBooks.map(book => {
    let score = 0;
    
    // Score based on matching genres from preferences
    preferences.forEach(prefGenre => {
      if (book.genres.includes(prefGenre)) {
        score += 2;
      }
    });
    
    // Score based on rating
    score += book.rating - 3; // Books rated 4-5 get positive scores
    
    // Score based on recency (in a real app)
    // This would factor in book publication date, popularity trends, etc.
    
    return { ...book, score };
  });
  
  // Sort by score and randomize slightly within top scores for variety
  return scoredBooks
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .sort(() => Math.random() > 0.7 ? 1 : -1);
}

// Get trending recommendations (could be based on global stats in a real app)
export function getTrendingRecommendations() {
  // In a real app, this would come from an API
  // For this demo, we'll select high-rated books and randomize
  return books
    .filter(book => book.rating >= 4.4)
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);
}

// Get similar books based on a given book
export function getSimilarBooks(book) {
  // Find books with matching genres
  return books
    .filter(b => 
      b.id !== book.id && 
      b.genres.some(genre => book.genres.includes(genre))
    )
    .sort((a, b) => {
      // Count how many matching genres
      const aMatches = a.genres.filter(genre => book.genres.includes(genre)).length;
      const bMatches = b.genres.filter(genre => book.genres.includes(genre)).length;
      
      // Sort by number of matching genres (descending) and then by rating
      return bMatches - aMatches || b.rating - a.rating;
    })
    .slice(0, 4);
}

// Generate a personalized reading list
export function getPersonalizedReadingList(preferences, readHistory) {
  // This would be more sophisticated in a real app
  // For now, we'll mix genre preferences with trending books
  
  const preferredGenreBooks = books.filter(book => 
    preferences.some(genre => book.genres.includes(genre))
  );
  
  const readBookIds = (readHistory || []).map(book => book.id);
  const unreadPreferredBooks = preferredGenreBooks.filter(book => 
    !readBookIds.includes(book.id)
  );
  
  // Sort by rating and diversify genres
  return unreadPreferredBooks
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 20)
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);
}