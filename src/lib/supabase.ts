import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.\n' +
      'Required variables:\n' +
      '  - VITE_SUPABASE_URL\n' +
      '  - VITE_SUPABASE_ANON_KEY\n\n' +
      'See .env.example for reference.'
  );
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

// Helper function to check connection
export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });

    if (error) {
      // If table doesn't exist yet, that's okay - connection is still working
      if (error.code === '42P01') {
        console.log('✅ Supabase connected (database tables not created yet)');
        return true;
      }
      console.error('❌ Supabase connection error:', error.message);
      return false;
    }

    console.log('✅ Supabase connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error);
    return false;
  }
}

// Export types for TypeScript
export type { User, Session, AuthError } from '@supabase/supabase-js';
