import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const getTotalUsers = async () => {
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  
  if (error) throw error;
  return count;
};

export const getTotalMessages = async () => {
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true });
  
  if (error) throw error;
  return count;
};

export const getNewUsersToday = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { count, error } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());
  
  if (error) throw error;
  return count;
};

export const getNewMessagesToday = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());
  
  if (error) throw error;
  return count;
};
