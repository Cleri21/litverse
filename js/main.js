import '../css/style.css';
import { books } from './data.js';
import { setupUI } from './ui.js';
import { initRecommendations } from './recommendations.js';
import { initNotifications } from './notifications.js';
import { initUserProfile } from './userProfile.js';
import { initAnalytics } from './analytics.js';

const API_URL = 'http://localhost:5000/api';

// Initialize the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Book recommendation system initialized');
  
  // Initialize all modules
  setupUI();
  initRecommendations();
  initNotifications();
  initUserProfile();
  initAnalytics();
  
  try {
    // Fetch trending books from API
    const response = await fetch(`${API_URL}/recommendations/trending`);
    const trendingBooks = await response.json();
    populateTrendingBooks(trendingBooks);
  } catch (error) {
    console.error('Error fetching trending books:', error);
    // Fallback to local data
    populateTrendingBooks(books);
  }
  
  // Check if user has already set preferences
  checkUserPreferences();
});

// Populate trending books section with mock data
function populateTrendingBooks() {
  const trendingContainer = document.getElementById('trending-container');
  
  // Filter some books as trending (in a real app, this would come from an API)
  const trendingBooks = books
    .filter(book => book.rating >= 4.3)
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);
  
  trendingBooks.forEach(book => {
    const bookCard = createBookCard(book);
    trendingContainer.appendChild(bookCard);
  });
  
  // Add animation to the trending section
  document.querySelectorAll('#trending-container .book-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('animate-slide-up');
  });
}

// Check if user has already set preferences
function checkUserPreferences() {
  const storedPreferences = localStorage.getItem('userPreferences');
  
  if (storedPreferences) {
    // User has preferences, show recommendations
    const preferences = JSON.parse(storedPreferences);
    showRecommendations(preferences);
    
    // Update the genre tabs based on preferences
    updateGenreTabs(preferences);
  } else {
    // Show get started button action
    const getStartedBtn = document.getElementById('get-started-btn');
    getStartedBtn.addEventListener('click', () => {
      document.getElementById('welcome-section').classList.add('hidden');
      document.getElementById('preferences-section').classList.remove('hidden');
      
      // Setup preference selection
      setupPreferenceSelection();
    });
  }
  
  // Setup genre tabs for browsing
  setupGenreTabs();
}

// Setup preference selection functionality
function setupPreferenceSelection() {
  const preferenceCards = document.querySelectorAll('.preference-card');
  const savePreferencesBtn = document.getElementById('save-preferences-btn');
  const selectedGenres = new Set();
  
  preferenceCards.forEach(card => {
    card.addEventListener('click', () => {
      const genre = card.dataset.genre;
      
      if (card.classList.contains('selected')) {
        card.classList.remove('selected');
        selectedGenres.delete(genre);
      } else {
        card.classList.add('selected');
        selectedGenres.add(genre);
      }
      
      // Enable/disable save button based on selection
      if (selectedGenres.size > 0) {
        savePreferencesBtn.removeAttribute('disabled');
      } else {
        savePreferencesBtn.setAttribute('disabled', 'true');
      }
    });
  });
  
  savePreferencesBtn.addEventListener('click', () => {
    if (selectedGenres.size > 0) {
      const preferences = Array.from(selectedGenres);
      
      // Save preferences to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // Hide preferences section and show recommendations
      document.getElementById('preferences-section').classList.add('hidden');
      showRecommendations(preferences);
      
      // Update genre tabs
      updateGenreTabs(preferences);
      
      // Generate welcome notification
      const notificationEvent = new CustomEvent('newNotification', {
        detail: {
          title: 'Welcome to Booksy!',
          message: 'We\'ve prepared some book recommendations just for you.',
          time: new Date().toISOString()
        }
      });
      document.dispatchEvent(notificationEvent);
    }
  });
}

// Show recommendations based on user preferences
function showRecommendations(preferences) {
  const recommendationsSection = document.getElementById('recommendations-section');
  const recommendationsContainer = document.getElementById('recommendations-container');
  
  // Clear current recommendations
  recommendationsContainer.innerHTML = '';
  
  // Get recommended books based on preferences
  const recommendedBooks = getRecommendedBooks(preferences);
  
  // Populate recommendations
  recommendedBooks.forEach(book => {
    const bookCard = createBookCard(book);
    recommendationsContainer.appendChild(bookCard);
  });
  
  // Show recommendations section with animation
  recommendationsSection.classList.remove('hidden');
  document.querySelectorAll('#recommendations-container .book-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('animate-slide-up');
  });
}

// Get recommended books based on user preferences
function getRecommendedBooks(preferences) {
  // Filter books based on user preferences
  const recommendedBooks = books.filter(book => 
    preferences.some(genre => book.genres.includes(genre))
  );
  
  // Sort by relevance (in a real app, this would use a sophisticated algorithm)
  // For now, we'll sort by rating and randomize a bit for variety
  return recommendedBooks
    .sort((a, b) => b.rating - a.rating)
    .sort(() => 0.3 - Math.random())
    .slice(0, 8);
}

// Setup genre tabs for browsing
function setupGenreTabs() {
  const genreTabs = document.querySelectorAll('.genre-tab');
  const genreContainer = document.getElementById('genre-container');
  
  // Initially show all books
  updateGenreDisplay('all');
  
  genreTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      genreTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Update displayed books
      const genre = tab.dataset.genre;
      updateGenreDisplay(genre);
    });
  });
  
  function updateGenreDisplay(genre) {
    // Clear current books
    genreContainer.innerHTML = '';
    
    // Filter books by genre
    let filteredBooks;
    if (genre === 'all') {
      filteredBooks = books.sort(() => 0.5 - Math.random()).slice(0, 12);
    } else {
      filteredBooks = books
        .filter(book => book.genres.includes(genre))
        .sort(() => 0.5 - Math.random())
        .slice(0, 12);
    }
    
    // Populate genre container
    filteredBooks.forEach(book => {
      const bookCard = createBookCard(book);
      genreContainer.appendChild(bookCard);
    });
    
    // Add animation
    document.querySelectorAll('#genre-container .book-card').forEach((card, index) => {
      card.style.animationDelay = `${index * 0.05}s`;
      card.classList.add('animate-slide-up');
    });
  }
}

// Update genre tabs based on user preferences
function updateGenreTabs(preferences) {
  // In a real app, we might want to reorder or highlight tabs based on preferences
  // For now, we'll just make sure the user's preferred genres are available as tabs
}

// Create a book card element
export function createBookCard(book) {
  const bookCard = document.createElement('div');
  bookCard.className = 'book-card';
  bookCard.dataset.id = book.id;
  
  // Generate star rating HTML
  const fullStars = Math.floor(book.rating);
  const halfStar = book.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let starsHtml = '';
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>';
  }
  if (halfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>';
  }
  
  bookCard.innerHTML = `
    <div class="book-cover">
      <img src="${book.coverImage}" alt="${book.title}">
    </div>
    <div class="book-info">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-author">${book.author}</p>
      <div class="book-rating">
        ${starsHtml}
        <span>${book.rating.toFixed(1)}</span>
      </div>
      <span class="book-genre">${book.genres[0]}</span>
    </div>
  `;
  
  // Add click event to show book details
  bookCard.addEventListener('click', () => {
    showBookDetails(book);
  });
  
  return bookCard;
}

// Show book details in modal
function showBookDetails(book) {
  const modal = document.getElementById('book-detail-modal');
  const overlay = document.getElementById('overlay');
  const bookDetailContainer = document.querySelector('.book-detail-container');
  
  // Generate star rating HTML
  const fullStars = Math.floor(book.rating);
  const halfStar = book.rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let starsHtml = '';
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>';
  }
  if (halfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>';
  }
  
  // Calculate reading time estimate (1 minute per 250 words)
  const wordCount = book.description.split(' ').length + 2000; // Adding 2000 for the rest of the book
  const readingTimeMinutes = Math.round(wordCount / 250);
  const readingTimeHours = Math.floor(readingTimeMinutes / 60);
  const remainingMinutes = readingTimeMinutes % 60;
  const readingTimeText = readingTimeHours > 0 
    ? `${readingTimeHours}h ${remainingMinutes}m` 
    : `${readingTimeMinutes}m`;
  
  // Find similar books
  const similarBooks = books
    .filter(b => 
      b.id !== book.id && 
      b.genres.some(genre => book.genres.includes(genre))
    )
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
  
  let similarBooksHtml = '';
  similarBooks.forEach(similarBook => {
    similarBooksHtml += `
      <div class="book-card" data-id="${similarBook.id}">
        <div class="book-cover">
          <img src="${similarBook.coverImage}" alt="${similarBook.title}">
        </div>
        <div class="book-info">
          <h3 class="book-title">${similarBook.title}</h3>
        </div>
      </div>
    `;
  });
  
  // Populate book details
  bookDetailContainer.innerHTML = `
    <div class="book-detail-header">
      <div class="book-detail-cover">
        <img src="${book.coverImage}" alt="${book.title}">
      </div>
      <div class="book-detail-info">
        <h2 class="book-detail-title">${book.title}</h2>
        <p class="book-detail-author">by ${book.author}</p>
        
        <div class="book-detail-meta">
          <div class="book-detail-meta-item">
            <i class="fas fa-star"></i>
            <span>${book.rating.toFixed(1)} (${(Math.floor(Math.random() * 1000) + 100)} reviews)</span>
          </div>
          <div class="book-detail-meta-item">
            <i class="fas fa-book"></i>
            <span>${(Math.floor(Math.random() * 500) + 100)} pages</span>
          </div>
          <div class="book-detail-meta-item">
            <i class="fas fa-clock"></i>
            <span>${readingTimeText} read</span>
          </div>
        </div>
        
        <div class="book-genres">
          ${book.genres.map(genre => `<span class="book-genre">${genre}</span>`).join('')}
        </div>
        
        <div class="book-detail-actions">
          <button class="btn primary-btn add-to-reading-btn">
            <i class="fas fa-book-reader"></i> Start Reading
          </button>
          <button class="btn outline-btn save-book-btn" data-id="${book.id}">
            <i class="far fa-bookmark"></i> Save
          </button>
        </div>
      </div>
    </div>
    
    <div class="book-detail-section">
      <h3>About the Book</h3>
      <p class="book-detail-description">${book.description}</p>
      
      <div class="reading-progress-container">
        <div class="reading-progress-bar" style="width: ${Math.floor(Math.random() * 30)}%"></div>
      </div>
      <p style="font-size: 0.8rem; color: var(--color-gray-500);">Reading progress across users</p>
    </div>
    
    <div class="book-detail-section">
      <h3>Similar Books You Might Enjoy</h3>
      <div class="similar-books">
        ${similarBooksHtml}
      </div>
    </div>
  `;
  
  // Track this book view for analytics
  trackBookView(book);
  
  // Show modal
  modal.classList.add('active');
  overlay.classList.add('active');
  
  // Setup event listeners for the modal
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  // Setup save book button
  const saveBookBtn = bookDetailContainer.querySelector('.save-book-btn');
  saveBookBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    saveBook(book);
    
    // Update button style
    saveBookBtn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
    saveBookBtn.classList.add('secondary-btn');
    saveBookBtn.classList.remove('outline-btn');
    
    // Trigger notification
    const notificationEvent = new CustomEvent('newNotification', {
      detail: {
        title: 'Book Saved',
        message: `"${book.title}" has been added to your saved books.`,
        time: new Date().toISOString()
      }
    });
    document.dispatchEvent(notificationEvent);
  });
  
  // Setup similar books click events
  const similarBookCards = bookDetailContainer.querySelectorAll('.similar-books .book-card');
  similarBookCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const bookId = card.dataset.id;
      const similarBook = books.find(b => b.id === bookId);
      if (similarBook) {
        closeModal();
        setTimeout(() => {
          showBookDetails(similarBook);
        }, 300);
      }
    });
  });
  
  // Setup start reading button
  const startReadingBtn = bookDetailContainer.querySelector('.add-to-reading-btn');
  startReadingBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    addToReadingList(book);
    
    // Update button style
    startReadingBtn.innerHTML = '<i class="fas fa-check"></i> Added to Reading';
    
    // Trigger notification
    const notificationEvent = new CustomEvent('newNotification', {
      detail: {
        title: 'Added to Reading List',
        message: `You've started reading "${book.title}". Enjoy!`,
        time: new Date().toISOString()
      }
    });
    document.dispatchEvent(notificationEvent);
    
    // Trigger analytics event
    const analyticsEvent = new CustomEvent('bookStarted', {
      detail: { book }
    });
    document.dispatchEvent(analyticsEvent);
  });
  
  function closeModal() {
    modal.classList.remove('active');
    overlay.classList.remove('active');
  }
}

// Track book view for analytics
function trackBookView(book) {
  // Dispatch book view event for analytics
  const bookViewEvent = new CustomEvent('bookViewed', {
    detail: { book }
  });
  document.dispatchEvent(bookViewEvent);
}

// Save book to user's saved books
function saveBook(book) {
  // Get current saved books from localStorage
  const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');
  
  // Check if book is already saved
  if (!savedBooks.some(b => b.id === book.id)) {
    savedBooks.push(book);
    localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
    
    // Update saved books count in profile
    document.getElementById('books-saved').textContent = savedBooks.length;
    
    // Update saved books list in profile
    updateSavedBooksList();
    
    // Dispatch event for analytics
    const bookSavedEvent = new CustomEvent('bookSaved', {
      detail: { book }
    });
    document.dispatchEvent(bookSavedEvent);
  }
}

// Add book to reading list
function addToReadingList(book) {
  // Get current reading list from localStorage
  const readingList = JSON.parse(localStorage.getItem('readingList') || '[]');
  
  // Check if book is already in reading list
  if (!readingList.some(b => b.id === book.id)) {
    // Add timestamp for tracking
    const bookWithTimestamp = {
      ...book,
      startedAt: new Date().toISOString(),
      progress: 0
    };
    
    readingList.push(bookWithTimestamp);
    localStorage.setItem('readingList', JSON.stringify(readingList));
    
    // Update books read count in profile
    document.getElementById('books-read').textContent = readingList.length;
    
    // Update reading history in profile
    updateReadingHistory();
  }
}

// Update saved books list in profile
function updateSavedBooksList() {
  const savedBooksContainer = document.getElementById('saved-books');
  const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]');
  
  if (savedBooks.length === 0) {
    savedBooksContainer.innerHTML = '<p class="empty-list-message">No saved books yet</p>';
    return;
  }
  
  savedBooksContainer.innerHTML = '';
  
  savedBooks.forEach(book => {
    const bookItem = document.createElement('div');
    bookItem.className = 'profile-book-item';
    bookItem.innerHTML = `
      <div class="profile-book-cover">
        <img src="${book.coverImage}" alt="${book.title}">
      </div>
      <div class="profile-book-info">
        <div class="profile-book-title">${book.title}</div>
        <div class="profile-book-author">${book.author}</div>
      </div>
    `;
    
    bookItem.addEventListener('click', () => {
      document.getElementById('profile-panel').classList.remove('active');
      document.getElementById('overlay').classList.remove('active');
      setTimeout(() => {
        showBookDetails(book);
      }, 300);
    });
    
    savedBooksContainer.appendChild(bookItem);
  });
}

// Update reading history in profile
function updateReadingHistory() {
  const readingHistoryContainer = document.getElementById('reading-history');
  const readingList = JSON.parse(localStorage.getItem('readingList') || '[]');
  
  if (readingList.length === 0) {
    readingHistoryContainer.innerHTML = '<p class="empty-list-message">No books in your history yet</p>';
    return;
  }
  
  readingHistoryContainer.innerHTML = '';
  
  // Sort by start date, newest first
  readingList
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
    .forEach(book => {
      const bookItem = document.createElement('div');
      bookItem.className = 'profile-book-item';
      bookItem.innerHTML = `
        <div class="profile-book-cover">
          <img src="${book.coverImage}" alt="${book.title}">
        </div>
        <div class="profile-book-info">
          <div class="profile-book-title">${book.title}</div>
          <div class="profile-book-author">${book.author}</div>
        </div>
      `;
      
      bookItem.addEventListener('click', () => {
        document.getElementById('profile-panel').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
        setTimeout(() => {
          showBookDetails(book);
        }, 300);
      });
      
      readingHistoryContainer.appendChild(bookItem);
    });
}

// Export functions for use in other modules
export {
  updateSavedBooksList,
  updateReadingHistory,
  showBookDetails
};