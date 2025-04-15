import { supabase } from './supabase';
import { clueLinks } from '../utils/clue';

export async function addUser(username: string): Promise<number> {
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
    nextId = maxIdResult.id >= 7 ? 0 : maxIdResult.id + 1;
  }

  // Insert new user with the calculated ID
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        id: nextId,
        username: username,
        clue: clueLinks[nextId],
      }
    ])
    .select();

  if (error) throw error;
  return nextId;
}