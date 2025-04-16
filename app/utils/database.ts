import { supabase } from './supabase';
import { clueLinks } from '../utils/clue';

export async function addUser(username: string): Promise<number> {
  // Convert username to lowercase
  const normalizedUsername = username.toLowerCase();

  // First check if the username already exists
  const { data: existingUser, error: lookupError } = await supabase
    .from('users')
    .select('id')
    .eq('username', normalizedUsername)
    .single();
    
  if (existingUser) {
    // User already exists, return their ID
    return existingUser.id;
  }

  // Get the maximum ID currently in use
  const { data: maxIdResult, error: maxIdError } = await supabase
    .from('users')
    .select('id')
    .order('id', { ascending: false })
    .limit(1)
    .single();

  if (maxIdError && maxIdError.code !== 'PGRST116') {
    throw maxIdError;
  }

  // Calculate next ID with rotation
  let nextId = 0;
  if (maxIdResult) {
    nextId = maxIdResult.id >= 33 ? 0 : maxIdResult.id + 1;
  }

  // Insert new user with the calculated ID
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        id: nextId,
        username: normalizedUsername,
        clue: clueLinks[nextId],
      }
    ])
    .select();

  if (error) throw error;
  return nextId;
}