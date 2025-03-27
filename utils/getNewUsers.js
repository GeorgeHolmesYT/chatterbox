import { supabase } from './supabase';

export async function getNewUsers() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching new users:', error);
    return [];
  }
}
