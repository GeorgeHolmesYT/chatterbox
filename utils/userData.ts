import { supabase } from './supabaseClient';
import { db, User } from '../db/dexie';
import { getCurrentUser } from './auth';

/**
 * Get user data by ID
 * @param userId User ID
 * @returns Promise resolving to user data
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    // First try to get from local database
    let user = await db.users.get(userId);
    
    if (!user) {
      // If not in local DB, fetch from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('id, username, email, avatar_url, last_seen')
        .eq('id', userId)
        .single();
        
      if (error || !data) {
        throw error || new Error('User not found');
      }
      
      // Format and store in local DB
      user = {
        id: data.id,
        username: data.username,
        email: data.email,
        avatarUrl: data.avatar_url,
        lastSeen: data.last_seen ? new Date(data.last_seen) : undefined
      };
      
      await db.users.put(user);
    }
    
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

/**
 * Update user's last seen timestamp
 */
export async function updateLastSeen(): Promise<void> {
  try {
    const user = await getCurrentUser();
    if (!user) return;
    
    // Update in Supabase
    await supabase
      .from('users')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', user.id);
      
    // Update in local DB
    await db.users.update(user.id, { 
      lastSeen: new Date() 
    });
  } catch (error) {
    console.error('Error updating last seen:', error);
  }
}

/**
 * Search for users by username
 * @param query Search query
 * @returns Promise resolving to array of matching users
 */
export async function searchUsers(query: string): Promise<User[]> {
  try {
    if (!query || query.length < 3) {
      return [];
    }
    
    // Search in Supabase
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, avatar_url')
      .ilike('username', `%${query}%`)
      .limit(10);
      
    if (error) {
      throw error;
    }
    
    // Format results
    const users: User[] = data.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatar_url
    }));
    
    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

/**
 * Update user profile
 * @param userId User ID
 * @param updates Profile updates
 * @returns Promise resolving to updated user
 */
export async function updateUserProfile(
  userId: string, 
  updates: Partial<User>
): Promise<User | null> {
  try {
    // Format for Supabase
    const supabaseUpdates: Record<string, any> = {};
    
    if (updates.username) supabaseUpdates.username = updates.username;
    if (updates.avatarUrl) supabaseUpdates.avatar_url = updates.avatarUrl;
    
    // Update in Supabase
    const { data, error } = await supabase
      .from('users')
      .update(supabaseUpdates)
      .eq('id', userId)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    // Update in local DB
    const updatedUser: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      avatarUrl: data.avatar_url,
      lastSeen: data.last_seen ? new Date(data.last_seen) : undefined
    };
    
    await db.users.update(userId, updatedUser);
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}
