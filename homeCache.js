import { getTotalUsers, getTotalMessages, getNewUsersToday, getNewMessagesToday } from './supabase';

let cache = {
  totalUsers: null,
  totalMessages: null,
  newUsers: null,
  newMessages: null,
  lastUpdated: null
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function getHomeStats() {
  const now = Date.now();
  
  // If cache is valid, return cached data
  if (cache.lastUpdated && (now - cache.lastUpdated < CACHE_DURATION)) {
    return cache;
  }
  
  // Otherwise, fetch new data
  try {
    const [totalUsers, totalMessages, newUsers, newMessages] = await Promise.all([
      getTotalUsers(),
      getTotalMessages(),
      getNewUsersToday(),
      getNewMessagesToday()
    ]);
    
    // Update cache
    cache = {
      totalUsers,
      totalMessages,
      newUsers,
      newMessages,
      lastUpdated: now
    };
    
    return cache;
  } catch (error) {
    console.error('Error fetching home stats:', error);
    
    // If we have cached data, return it even if expired
    if (cache.lastUpdated) {
      return cache;
    }
    
    // Otherwise return zeros
    return {
      totalUsers: 0,
      totalMessages: 0,
      newUsers: 0,
      newMessages: 0,
      lastUpdated: now
    };
  }
}

export function invalidateCache() {
  cache.lastUpdated = null;
}
