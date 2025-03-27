/**
 * Default user settings for new accounts
 */

export const DEFAULT_USER_SETTINGS = {
  // Theme settings
  theme: 'dark', // 'dark' or 'light'
  customThemeColors: null, // For custom theme colors
  
  // Language settings
  language: 'en', // 'en', 'es', etc.
  
  // Notification settings
  notifications: {
    email: {
      messages: true,
      mentions: true,
      friendRequests: true,
      announcements: true
    },
    push: {
      messages: true,
      mentions: true,
      friendRequests: true,
      announcements: false
    },
    sounds: {
      messages: true,
      mentions: true,
      calls: true
    }
  },
  
  // Privacy settings
  privacy: {
    allowFriendRequests: 'everyone', // 'everyone', 'friendsOfFriends', 'nobody'
    allowMessagesFrom: 'friends', // 'everyone', 'friends', 'nobody'
    showOnlineStatus: true,
    showLastSeen: true,
    showReadReceipts: true
  },
  
  // Accessibility settings
  accessibility: {
    fontSize: 'medium', // 'small', 'medium', 'large', 'x-large'
    highContrast: false,
    reduceMotion: false,
    screenReaderOptimized: false
  },
  
  // Chat settings
  chat: {
    enterToSend: true,
    showTimestamps: true,
    messageGrouping: true,
    emojiStyle: 'native', // 'native', 'twitter', 'facebook', etc.
    defaultEmojiSkinTone: 1 // 1-6 for different skin tones
  },
  
  // Display settings
  display: {
    compactMode: false,
    showUserAvatars: true,
    showStatusIndicators: true,
    sidebarPosition: 'left', // 'left' or 'right'
    messageDisplayDensity: 'comfortable' // 'compact', 'comfortable', 'spacious'
  }
};

/**
 * Get a specific setting with a path
 * @param {Object} settings - The settings object
 * @param {string} path - Dot notation path to the setting (e.g., 'notifications.email.messages')
 * @returns {any} The setting value or undefined if not found
 */
export const getSetting = (settings, path) => {
  const parts = path.split('.');
  let current = settings || DEFAULT_USER_SETTINGS;
  
  for (const part of parts) {
    if (current === undefined || current === null) {
      return undefined;
    }
    current = current[part];
  }
  
  return current;
};

/**
 * Merge user settings with defaults
 * @param {Object} userSettings - The user's current settings
 * @returns {Object} Complete settings object with defaults for any missing values
 */
export const mergeWithDefaults = (userSettings) => {
  if (!userSettings) return { ...DEFAULT_USER_SETTINGS };
  
  // Deep merge function for nested objects
  const deepMerge = (target, source) => {
    const output = { ...target };
    
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = deepMerge(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }
    
    return output;
  };
  
  const isObject = (item) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
  };
  
  return deepMerge(DEFAULT_USER_SETTINGS, userSettings);
};
