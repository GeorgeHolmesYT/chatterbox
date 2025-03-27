import { getHomeStats } from './homeCache';

export async function getHomePageData() {
  try {
    const stats = await getHomeStats();
    
    return {
      stats,
      success: true
    };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return {
      stats: {
        totalUsers: 0,
        totalMessages: 0,
        newUsers: 0,
        newMessages: 0
      },
      success: false,
      error: error.message
    };
  }
}
