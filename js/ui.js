// UI-related functionality for the Book Recommendation System
import { createBookCard } from './main.js';

export function setupUI() {
  // Initialize UI elements and event listeners
  initializeUIComponents();
  setupHeaderScroll();
  setupNotificationPanel();
  setupProfilePanel();
  setupOverlay();
}

// Initialize UI components
function initializeUIComponents() {
  console.log('Initializing UI components');
  
  // Add any initial UI setup here
  animateWelcomeSection();
}

// Animate welcome section
function animateWelcomeSection() {
  const welcomeContent = document.querySelector('.welcome-content');
  const welcomeImage = document.querySelector('.welcome-image');
  
  if (welcomeContent && welcomeImage) {
    welcomeContent.classList.add('animate-fade-in');
    welcomeImage.classList.add('animate-fade-in');
  }
}

// Setup header scroll behavior
function setupHeaderScroll() {
  const header = document.getElementById('header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow when scrolled
    if (scrollTop > 10) {
      header.style.boxShadow = 'var(--shadow-md)';
    } else {
      header.style.boxShadow = 'var(--shadow-sm)';
    }
    
    // Hide/show header on scroll direction
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down, hide header
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up, show header
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });
}

// Setup notification panel
function setupNotificationPanel() {
  const notificationBtn = document.getElementById('notification-btn');
  const notificationPanel = document.getElementById('notification-panel');
  const overlay = document.getElementById('overlay');
  
  notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Close profile panel if open
    document.getElementById('profile-panel').classList.remove('active');
    document.getElementById('analysis-panel').classList.remove('active');
    
    // Toggle notification panel
    notificationPanel.classList.toggle('active');
    overlay.classList.toggle('active');
  });
}

// Setup profile panel
function setupProfilePanel() {
  const profileBtn = document.getElementById('profile-btn');
  const profilePanel = document.getElementById('profile-panel');
  const analysisPanel = document.getElementById('analysis-panel');
  const overlay = document.getElementById('overlay');
  
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Close notification panel if open
    document.getElementById('notification-panel').classList.remove('active');
    
    // Toggle profile panel
    profilePanel.classList.toggle('active');
    overlay.classList.toggle('active');
  });
  
  // Close profile panel button
  document.querySelector('#profile-panel .close-panel').addEventListener('click', () => {
    profilePanel.classList.remove('active');
    overlay.classList.remove('active');
  });
  
  // Close analysis panel button
  document.querySelector('#analysis-panel .close-panel').addEventListener('click', () => {
    analysisPanel.classList.remove('active');
    overlay.classList.remove('active');
  });
  
  // Edit preferences button
  document.getElementById('edit-preferences-btn').addEventListener('click', () => {
    profilePanel.classList.remove('active');
    overlay.classList.remove('active');
    
    // Show preferences section
    document.getElementById('welcome-section').classList.add('hidden');
    document.getElementById('recommendations-section').classList.add('hidden');
    document.getElementById('preferences-section').classList.remove('hidden');
    
    // Setup preferences again
    setupPreferenceSelection();
  });
}

// Setup overlay (background for modals and panels)
function setupOverlay() {
  const overlay = document.getElementById('overlay');
  
  overlay.addEventListener('click', () => {
    // Close all panels and modals
    document.getElementById('notification-panel').classList.remove('active');
    document.getElementById('profile-panel').classList.remove('active');
    document.getElementById('analysis-panel').classList.remove('active');
    document.getElementById('book-detail-modal').classList.remove('active');
    overlay.classList.remove('active');
  });
}

// Setup preference selection
function setupPreferenceSelection() {
  const preferenceCards = document.querySelectorAll('.preference-card');
  const savePreferencesBtn = document.getElementById('save-preferences-btn');
  const selectedGenres = new Set();
  
  // Get existing preferences
  const storedPreferences = JSON.parse(localStorage.getItem('userPreferences') || '[]');
  
  // Mark already selected preferences
  storedPreferences.forEach(genre => {
    const card = document.querySelector(`.preference-card[data-genre="${genre}"]`);
    if (card) {
      card.classList.add('selected');
      selectedGenres.add(genre);
    }
  });
  
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
      
      // Reload page to refresh recommendations
      window.location.reload();
    }
  });
}

// Helper function to create a notification element
export function createNotificationElement(notification) {
  const notificationItem = document.createElement('div');
  notificationItem.className = 'notification-item';
  
  if (!notification.read) {
    notificationItem.classList.add('unread');
  }
  
  const time = new Date(notification.time);
  const timeString = formatNotificationTime(time);
  
  notificationItem.innerHTML = `
    <div class="notification-time">${timeString}</div>
    <div class="notification-content">${notification.message}</div>
  `;
  
  return notificationItem;
}

// Format time for notifications
function formatNotificationTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return 'Just now';
  }
}

// Display insights in the analysis panel
export function displayInsights(insights) {
  const insightsList = document.getElementById('insights-list');
  
  if (!insightsList) return;
  
  insightsList.innerHTML = '';
  
  insights.forEach(insight => {
    const li = document.createElement('li');
    li.textContent = insight;
    insightsList.appendChild(li);
  });
}

// Display genre chart in analysis panel
export function displayGenreChart(genreCounts) {
  const chartContainer = document.getElementById('genre-chart');
  
  if (!chartContainer) return;
  
  if (Object.keys(genreCounts).length === 0) {
    chartContainer.innerHTML = `
      <div class="chart-placeholder">
        <p>No reading data available yet.</p>
        <p>Start reading books to see your genre distribution!</p>
      </div>
    `;
    return;
  }
  
  // Create a simple bar chart
  const maxCount = Math.max(...Object.values(genreCounts));
  const chartHtml = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([genre, count]) => {
      const percentage = Math.round((count / maxCount) * 100);
      return `
        <div class="chart-bar">
          <div class="chart-label">${genre}</div>
          <div class="chart-bar-container">
            <div class="chart-bar-fill" style="width: ${percentage}%; background-color: var(--color-primary-${Math.floor(Math.random() * 4) + 3}00);"></div>
            <span class="chart-value">${count}</span>
          </div>
        </div>
      `;
    })
    .join('');
  
  chartContainer.innerHTML = `
    <div class="bar-chart">
      ${chartHtml}
    </div>
  `;
}

// Add search functionality
export function setupSearch(books) {
  const searchInput = document.getElementById('search-input');
  
  searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) return;
    
    // Search books by title, author, or genre
    const results = books.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query) ||
      book.genres.some(genre => genre.toLowerCase().includes(query))
    );
    
    // Show search results
    showSearchResults(results);
  }, 300));
}

// Show search results
function showSearchResults(results) {
  // Hide other sections
  document.getElementById('welcome-section').classList.add('hidden');
  document.getElementById('trending-section').classList.add('hidden');
  document.getElementById('genres-section').classList.add('hidden');
  
  // Get or create search results section
  let searchSection = document.getElementById('search-section');
  
  if (!searchSection) {
    searchSection = document.createElement('section');
    searchSection.id = 'search-section';
    searchSection.className = 'section';
    searchSection.innerHTML = `
      <h2>Search Results</h2>
      <div class="book-grid" id="search-results"></div>
    `;
    document.querySelector('main .container').appendChild(searchSection);
  } else {
    searchSection.classList.remove('hidden');
  }
  
  const searchResults = document.getElementById('search-results');
  searchResults.innerHTML = '';
  
  if (results.length === 0) {
    searchResults.innerHTML = '<p class="empty-search">No books found matching your search.</p>';
    return;
  }
  
  // Add results to the grid
  results.forEach(book => {
    const bookCard = createBookCard(book);
    searchResults.appendChild(bookCard);
  });
}

// Debounce function for search
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}