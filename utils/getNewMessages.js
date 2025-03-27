import { supabase } from './supabase';

export async function getNewMessages() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('messages')
      .select('*, user:users(username, avatar_url)')
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching new messages:', error);
    return [];
  }
}
