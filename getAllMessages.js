import { supabase } from './supabase';

export async function getAllMessages() {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*, user:users(username, avatar_url)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching all messages:', error);
    return [];
  }
}
