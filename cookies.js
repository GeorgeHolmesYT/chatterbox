/**
 * Utility functions for handling cookies in the browser
 */

/**
 * Set a cookie with the given name, value, and expiration days
 * @param {string} name - The name of the cookie
 * @param {string} value - The value to store in the cookie
 * @param {number} days - Number of days until the cookie expires
 */
export const setCookie = (name, value, days) => {
  if (typeof window === 'undefined') return;
  
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
};

/**
 * Get a cookie value by name
 * @param {string} name - The name of the cookie to retrieve
 * @returns {string|null} The cookie value or null if not found
 */
export const getCookie = (name) => {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
};

/**
 * Remove a cookie by name
 * @param {string} name - The name of the cookie to remove
 */
export const removeCookie = (name) => {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
};

/**
 * Check if a cookie exists
 * @param {string} name - The name of the cookie to check
 * @returns {boolean} True if the cookie exists, false otherwise
 */
export const hasCookie = (name) => {
  return getCookie(name) !== null;
};
