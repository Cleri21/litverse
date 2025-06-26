// Analytics for the Book Recommendation System
import { displayInsights, displayGenreChart } from './ui.js';
import { getReadingHistory, getUserPreferences } from './userProfile.js';

export function initAnalytics() {
  // Initialize analytics system
  console.log('Initializing analytics engine');
  
  // Set up event listeners for tracking
  setupAnalyticsTracking();
  
  // Set up analysis panel events
  setupAnalysisPanelEvents();
  
  // Generate initial insights
  generateInitialInsights();
}

// Setup analytics tracking events
function setupAnalyticsTracking() {
  // Track book views
  document.addEventListener('bookViewed', (event) => {
    const book = event.detail.book;
    trackBookView(book);
  });
  
  // Track books saved
  document.addEventListener('bookSaved', (event) => {
    const book = event.detail.book;
    trackBookSaved(book);
  });
  
  // Track books started reading
  document.addEventListener('bookStarted', (event) => {
    const book = event.detail.book;
    trackBookStarted(book);
  });
  
  // Track books completed
  document.addEventListener('bookCompleted', (event) => {
    const book = event.detail.book;
    trackBookCompleted(book);
  });
  
  // Track analysis updated
  document.addEventListener('analysisUpdated', () => {
    updateAnalysis();
  });
}

// Setup analysis panel events
function setupAnalysisPanelEvents() {
  const profileBtn = document.getElementById('profile-btn');
  const analysisPanel = document.getElementById('analysis-panel');
  const profilePanel = document.getElementById('profile-panel');
  
  // Add analysis button to profile panel
  const analysisButton = document.createElement('button');
  analysisButton.id = 'view-analysis-btn';
  analysisButton.className = 'btn accent-btn';
  analysisButton.style.marginTop = 'var(--space-4)';
  analysisButton.innerHTML = '<i class="fas fa-chart-pie"></i> View Reading Analysis';
  
  // Add button after edit preferences button
  const editPreferencesBtn = document.getElementById('edit-preferences-btn');
  if (editPreferencesBtn && editPreferencesBtn.parentNode) {
    editPreferencesBtn.parentNode.appendChild(analysisButton);
    
    // Add click event
    analysisButton.addEventListener('click', () => {
      // Hide profile panel
      profilePanel.classList.remove('active');
      
      // Show analysis panel
      analysisPanel.classList.add('active');
      
      // Make sure overlay is active
      document.getElementById('overlay').classList.add('active');
      
      // Update analysis
      updateAnalysis();
    });
  }
}

// Generate initial insights
function generateInitialInsights() {
  // In a real app, this would analyze user behavior and generate personalized insights
  // For this demo, we'll create some static insights
  
  const insights = [
    'Welcome to your reading analysis! Start reading books to see personalized insights.',
    'We\'ll analyze your reading patterns to help you discover new books you\'ll love.',
    'Your preferences will help us tailor recommendations just for you.'
  ];
  
  // Store insights
  localStorage.setItem('userInsights', JSON.stringify(insights));
  
  // Display insights in UI
  displayInsights(insights);
}

// Track book view
function trackBookView(book) {
  // Get book view history
  const bookViews = JSON.parse(localStorage.getItem('bookViewHistory') || '[]');
  
  // Add new view with timestamp
  bookViews.push({
    bookId: book.id,
    timestamp: new Date().toISOString(),
    genres: book.genres
  });
  
  // Keep only recent history (limit to 100 entries)
  if (bookViews.length > 100) {
    bookViews.shift();
  }
  
  // Save to localStorage
  localStorage.setItem('bookViewHistory', JSON.stringify(bookViews));
}

// Track book saved
function trackBookSaved(book) {
  // Update genre preferences based on saved books
  updateGenrePreferences(book.genres, 2); // Weighted more heavily
}

// Track book started reading
function trackBookStarted(book) {
  // Update genre preferences based on reading choices
  updateGenrePreferences(book.genres, 3); // Weighted most heavily
}

// Track book completed
function trackBookCompleted(book) {
  // Update genre preferences based on completed books
  updateGenrePreferences(book.genres, 4); // Weighted very heavily
  
  // Update analysis with completion
  updateAnalysisWithCompletion(book);
}

// Update genre preferences based on user actions
function updateGenrePreferences(genres, weight) {
  // Get current genre weights
  const genreWeights = JSON.parse(localStorage.getItem('genreWeights') || '{}');
  
  // Update weights
  genres.forEach(genre => {
    genreWeights[genre] = (genreWeights[genre] || 0) + weight;
  });
  
  // Save to localStorage
  localStorage.setItem('genreWeights', JSON.stringify(genreWeights));
}

// Update analysis with book completion
function updateAnalysisWithCompletion(book) {
  // Get reading speed data
  const readingHistory = getReadingHistory();
  const completedBook = readingHistory.find(b => b.id === book.id);
  
  if (completedBook) {
    const startDate = new Date(completedBook.startedAt);
    const endDate = new Date();
    const daysToComplete = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // Save reading speed data
    const readingSpeeds = JSON.parse(localStorage.getItem('readingSpeeds') || '[]');
    readingSpeeds.push({
      bookId: book.id,
      title: book.title,
      daysToComplete,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('readingSpeeds', JSON.stringify(readingSpeeds));
    
    // Update analysis
    updateAnalysis();
  }
}

// Update analysis panel with latest data
function updateAnalysis() {
  // Get user data
  const readingHistory = getReadingHistory();
  const preferences = getUserPreferences();
  const genreWeights = JSON.parse(localStorage.getItem('genreWeights') || '{}');
  const readingSpeeds = JSON.parse(localStorage.getItem('readingSpeeds') || '[]');
  
  // Generate genre distribution data
  const genreCounts = {};
  
  readingHistory.forEach(book => {
    book.genres.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });
  
  // Display genre chart
  displayGenreChart(genreCounts);
  
  // Generate insights
  const insights = generateInsights(readingHistory, preferences, genreWeights, readingSpeeds);
  displayInsights(insights);
  
  // Store insights
  localStorage.setItem('userInsights', JSON.stringify(insights));
}

// Generate insights based on user data
function generateInsights(readingHistory, preferences, genreWeights, readingSpeeds) {
  const insights = [];
  
  // If no reading history yet
  if (readingHistory.length === 0) {
    insights.push('Start your reading journey by adding books to your reading list!');
    insights.push('Your personalized insights will appear here as you read more books.');
    insights.push('We\'ll analyze your reading patterns to help you discover new favorites.');
    return insights;
  }
  
  // Reading activity insights
  const booksStarted = readingHistory.length;
  const booksCompleted = readingHistory.filter(book => book.progress === 100).length;
  
  insights.push(`You've started reading ${booksStarted} book${booksStarted !== 1 ? 's' : ''} and completed ${booksCompleted}.`);
  
  // Favorite genre insight
  if (Object.keys(genreWeights).length > 0) {
    const topGenre = Object.entries(genreWeights)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    insights.push(`Your favorite genre appears to be ${formatGenreName(topGenre)}.`);
  }
  
  // Reading speed insight
  if (readingSpeeds.length > 0) {
    const avgDays = readingSpeeds.reduce((sum, item) => sum + item.daysToComplete, 0) / readingSpeeds.length;
    
    if (avgDays < 7) {
      insights.push(`You're a fast reader! You finish books in about ${Math.round(avgDays)} days on average.`);
    } else if (avgDays < 14) {
      insights.push(`You have a steady reading pace, finishing books in about ${Math.round(avgDays)} days on average.`);
    } else {
      insights.push(`You take your time with books, spending about ${Math.round(avgDays)} days to complete each one.`);
    }
  }
  
  // Reading consistency insight
  const recentReads = readingHistory
    .filter(book => new Date(book.lastRead) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .length;
  
  if (recentReads > 0) {
    insights.push(`You've been active with ${recentReads} book${recentReads !== 1 ? 's' : ''} in the past month.`);
  } else if (readingHistory.length > 0) {
    insights.push('It\'s been a while since you last read. Why not pick up where you left off?');
  }
  
  // Diverse reading insight
  const uniqueGenres = new Set();
  readingHistory.forEach(book => {
    book.genres.forEach(genre => uniqueGenres.add(genre));
  });
  
  if (uniqueGenres.size > 3) {
    insights.push(`You have diverse reading tastes, exploring ${uniqueGenres.size} different genres!`);
  } else if (uniqueGenres.size > 1) {
    insights.push(`You've explored ${uniqueGenres.size} genres so far. Consider branching out to discover new favorites!`);
  }
  
  // Recommendation for underrepresented preferences
  const underrepresentedPreferences = preferences.filter(pref => 
    !genreWeights[pref] || genreWeights[pref] < 2
  );
  
  if (underrepresentedPreferences.length > 0) {
    const genre = formatGenreName(underrepresentedPreferences[0]);
    insights.push(`You've shown interest in ${genre} but haven't read much in this genre. Try exploring more ${genre} books!`);
  }
  
  return insights;
}

// Format genre name for display
function formatGenreName(genre) {
  return genre
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}