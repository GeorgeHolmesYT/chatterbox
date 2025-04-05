import { supabase } from './supabaseClient';


export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
}

/**
 * Get the current authenticated user
 * @returns A promise that resolves to the current user or null
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return null;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      username: user.user_metadata?.username || '',
      avatar_url: user.user_metadata?.avatar_url,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Sign in with email and password
 * @param email User's email
 * @param password User's password
 * @returns A promise that resolves to the signed-in user or an error
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return {
      user: data.user ? {
        id: data.user.id,
        email: data.user.email || '',
        username: data.user.user_metadata?.username || '',
        avatar_url: data.user.user_metadata?.avatar_url,
      } : null,
      session: data.session,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Sign out the current user
 * @returns A promise that resolves when the user is signed out
 */
export async function signOut() {
  try {
    await supabase.auth.signOut();
    // Remove any auth cookies if needed
    if (typeof document !== 'undefined') {
      document.cookie = 'sb-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Update the current user's profile
 * @param profile Profile data to update
 * @returns A promise that resolves to the updated user
 */
export async function updateProfile(profile: Partial<AuthUser>) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: profile,
    });

    if (error) {
      throw error;
    }

    return data.user ? {
      id: data.user.id,
      email: data.user.email || '',
      username: data.user.user_metadata?.username || '',
      avatar_url: data.user.user_metadata?.avatar_url,
    } : null;
  } catch (error) {
    throw error;
  }
}