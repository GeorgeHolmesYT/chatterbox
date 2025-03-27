/**
 * Utility functions for user data management
 */

import { setCookie, getCookie, removeCookie } from './cookies';

/**
 * Create a new user
 * @param {Object} userData - User data including username, email, password, dateOfBirth, etc.
 * @returns {Promise<Object>} The created user object with token
 */
export const createUser = async (userData) => {
  try {
    // In a real app, this would be an API call to your backend
    // For now, we'll simulate it with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate a successful response
    const user = {
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      username: userData.username,
      email: userData.email,
      dateOfBirth: userData.dateOfBirth,
      createdAt: new Date().toISOString(),
      settings: userData.settings || {},
      verified: false,
      token: `token_${Math.random().toString(36).substr(2, 16)}`
    };
    
    // In a real app, you would not store this in localStorage
    // This is just for demo purposes
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user account');
  }
};

/**
 * Check if a user exists by a specific field
 * @param {string} field - The field to check (username, email)
 * @param {string} value - The value to check
 * @returns {Promise<boolean>} True if the user exists, false otherwise
 */
export const checkUserExists = async (field, value) => {
  try {
    // In a real app, this would be an API call to your backend
    // For now, we'll simulate it with a delay and some fake logic
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate checking for existing users
    // For demo purposes, let's say usernames containing "admin" or "test" are taken
    if (field === 'username') {
      return value.toLowerCase().includes('admin') || 
             value.toLowerCase().includes('test') ||
             value.toLowerCase() === 'johndoe';
    }
    
    // For demo purposes, let's say emails with "admin" or "test" or specific domains are taken
    if (field === 'email') {
      return value.toLowerCase().includes('admin@') || 
             value.toLowerCase().includes('test@') ||
             value.toLowerCase() === 'john@example.com';
    }
    
    return false;
  } catch (error) {
    console.error(`Error checking if user ${field} exists:`, error);
    // Default to false to allow the user to try to proceed
    return false;
  }
};

/**
 * Validate username format
 * @param {string} username - The username to validate
 * @returns {boolean} True if the username is valid, false otherwise
 */
export const validateUsername = (username) => {
  // Username must be 3-20 characters and can only contain letters, numbers, and underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if the email is valid, false otherwise
 */
export const validateEmail = (email) => {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get the current user from localStorage or cookie
 * @returns {Object|null} The current user object or null if not logged in
 */
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      return JSON.parse(userJson);
    }
    
    // If not in localStorage, check for auth token in cookies
    const token = getCookie('auth_token');
    if (token) {
      // In a real app, you would validate this token with your backend
      // For now, just return a basic user object
      return {
        id: 'unknown',
        token,
        isTokenOnly: true
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Log out the current user
 */
export const logoutUser = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('currentUser');
    removeCookie('auth_token');
  } catch (error) {
    console.error('Error logging out user:', error);
  }
};

/**
 * Update user settings
 * @param {Object} settings - The settings to update
 * @returns {Promise<Object>} The updated user object
 */
export const updateUserSettings = async (settings) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('No user is logged in');
    }
    
    // In a real app, this would be an API call to your backend
    // For now, we'll simulate it with a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update the user object
    const updatedUser = {
      ...currentUser,
      settings: {
        ...(currentUser.settings || {}),
        ...settings
      }
    };
    
    // Save the updated user
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw new Error('Failed to update user settings');
  }
};
