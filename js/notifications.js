// Notification system for the Book Recommendation System
import { createNotificationElement } from './ui.js';

export function initNotifications() {
  // Initialize the notification system
  console.log('Initializing notification system');
  
  // Load saved notifications
  loadNotifications();
  
  // Set up notification listeners
  setupNotificationListeners();
  
  // Set up clear notifications button
  setupClearNotificationsButton();
  
  // Set up automated notifications
  setupAutomatedNotifications();
}

// Load saved notifications from localStorage
function loadNotifications() {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  const notificationList = document.getElementById('notification-list');
  
  if (notifications.length === 0) {
    notificationList.innerHTML = '<p class="empty-list-message">No notifications</p>';
    return;
  }
  
  // Sort notifications by time, newest first
  notifications
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .forEach(notification => {
      const notificationElement = createNotificationElement(notification);
      notificationList.appendChild(notificationElement);
    });
  
  // Update notification badge
  updateNotificationBadge(notifications);
}

// Set up notification listeners
function setupNotificationListeners() {
  // Listen for new notifications
  document.addEventListener('newNotification', (event) => {
    const notification = {
      ...event.detail,
      read: false,
      id: Date.now()
    };
    
    // Add notification to storage
    addNotification(notification);
    
    // Show notification alert (visual feedback)
    showNotificationAlert();
  });
  
  // Listen for notification clicks (mark as read)
  document.getElementById('notification-list').addEventListener('click', (event) => {
    const notificationItem = event.target.closest('.notification-item');
    if (notificationItem && notificationItem.classList.contains('unread')) {
      markNotificationAsRead(notificationItem);
    }
  });
}

// Set up clear notifications button
function setupClearNotificationsButton() {
  const clearButton = document.getElementById('clear-notifications-btn');
  
  clearButton.addEventListener('click', () => {
    clearAllNotifications();
  });
}

// Add notification to storage and UI
function addNotification(notification) {
  // Get current notifications
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  
  // Add new notification
  notifications.unshift(notification);
  
  // Limit to 20 notifications
  if (notifications.length > 20) {
    notifications.pop();
  }
  
  // Save to localStorage
  localStorage.setItem('notifications', JSON.stringify(notifications));
  
  // Update UI
  const notificationList = document.getElementById('notification-list');
  
  // Clear empty message if present
  const emptyMessage = notificationList.querySelector('.empty-list-message');
  if (emptyMessage) {
    notificationList.innerHTML = '';
  }
  
  // Add to notification list
  const notificationElement = createNotificationElement(notification);
  notificationList.insertBefore(notificationElement, notificationList.firstChild);
  
  // Update notification badge
  updateNotificationBadge(notifications);
}

// Mark notification as read
function markNotificationAsRead(notificationElement) {
  // Update UI
  notificationElement.classList.remove('unread');
  
  // Get current notifications
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  
  // Find the notification by content and mark as read
  const notificationContent = notificationElement.querySelector('.notification-content').textContent;
  
  const updatedNotifications = notifications.map(notification => {
    if (notification.message === notificationContent && !notification.read) {
      return { ...notification, read: true };
    }
    return notification;
  });
  
  // Save to localStorage
  localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  
  // Update notification badge
  updateNotificationBadge(updatedNotifications);
}

// Clear all notifications
function clearAllNotifications() {
  // Clear localStorage
  localStorage.setItem('notifications', JSON.stringify([]));
  
  // Update UI
  const notificationList = document.getElementById('notification-list');
  notificationList.innerHTML = '<p class="empty-list-message">No notifications</p>';
  
  // Update notification badge
  updateNotificationBadge([]);
}

// Update notification badge
function updateNotificationBadge(notifications) {
  const badge = document.querySelector('.notification-badge');
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  badge.textContent = unreadCount;
  
  if (unreadCount > 0) {
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

// Show notification alert animation
function showNotificationAlert() {
  const notificationBtn = document.getElementById('notification-btn');
  
  // Add alert animation
  notificationBtn.classList.add('animate-pulse');
  
  // Remove animation after 2 seconds
  setTimeout(() => {
    notificationBtn.classList.remove('animate-pulse');
  }, 2000);
}

// Set up automated notifications
function setupAutomatedNotifications() {
  // Simulate periodic notifications for demo purposes
  
  // Timeout for "new book" notification (6-10 minutes)
  const newBookTimeout = (Math.random() * 4 + 6) * 60 * 1000;
  setTimeout(() => {
    const newBookNotification = {
      title: 'New Book Available',
      message: 'A new book matching your preferences is now available!',
      time: new Date().toISOString()
    };
    document.dispatchEvent(new CustomEvent('newNotification', { detail: newBookNotification }));
  }, newBookTimeout);
  
  // Timeout for "reading reminder" notification (2-5 minutes)
  const reminderTimeout = (Math.random() * 3 + 2) * 60 * 1000;
  setTimeout(() => {
    const reminderNotification = {
      title: 'Reading Reminder',
      message: 'Continue your reading journey with books from your list!',
      time: new Date().toISOString()
    };
    document.dispatchEvent(new CustomEvent('newNotification', { detail: reminderNotification }));
  }, reminderTimeout);
  
  // Timeout for "analysis update" notification (7-12 minutes)
  const analysisTimeout = (Math.random() * 5 + 7) * 60 * 1000;
  setTimeout(() => {
    const analysisNotification = {
      title: 'Reading Analysis Updated',
      message: 'We\'ve analyzed your reading patterns. Check out your insights!',
      time: new Date().toISOString()
    };
    document.dispatchEvent(new CustomEvent('newNotification', { detail: analysisNotification }));
    
    // This notification will trigger the analysis panel to update
    document.dispatchEvent(new CustomEvent('analysisUpdated'));
  }, analysisTimeout);
}