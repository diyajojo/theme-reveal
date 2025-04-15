import { createClient, SupabaseClient } from "@supabase/supabase-js";

const anonKey = process.env.NEXT_PUBLIC_ANONKEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseUrl || !anonKey) {
  throw new Error("Missing Supabase environment variables");
}

let supabase: SupabaseClient;

try {
  supabase = createClient(supabaseUrl, anonKey);
} catch (error) {
  console.error("Error creating Supabase client:", error);
  throw new Error("Failed to initialize Supabase client");
}

export { supabase };