import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

// =====================================================
// TYPES
// =====================================================

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  avatar_url?: string;
  bio?: string;
  study_goal?: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

// =====================================================
// AUTHENTICATION SERVICE
// =====================================================

export const authService = {
  /**
   * Sign up a new user with email and password
   */
  async signUp({ name, email, password }: SignUpData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name, // This will be used in the handle_new_user trigger
          },
        },
      });

      if (error) {
        return { user: null, session: null, error };
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as Error,
      };
    }
  },

  /**
   * Sign in an existing user with email and password
   */
  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, session: null, error };
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: error as Error,
      };
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  },

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  },

  /**
   * Update user password (must be authenticated)
   */
  async updatePassword(newPassword: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  },

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Get the current session
   */
  async getSession(): Promise<Session | null> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  /**
   * Update user profile in the users table
   */
  async updateProfile(userId: string, data: UpdateProfileData): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  },

  /**
   * Get user profile from users table
   */
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

      if (error) {
        return { profile: null, error };
      }

      return { profile: data, error: null };
    } catch (error) {
      return { profile: null, error: error as Error };
    }
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await authService.getSession();
  return !!session;
}

/**
 * Get user ID from session
 */
export async function getUserId(): Promise<string | null> {
  const user = await authService.getCurrentUser();
  return user?.id || null;
}

/**
 * Format auth error messages for display
 */
export function formatAuthError(error: Error): string {
  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password';
  }
  if (message.includes('user already registered')) {
    return 'An account with this email already exists';
  }
  if (message.includes('email not confirmed')) {
    return 'Please confirm your email address';
  }
  if (message.includes('password should be at least')) {
    return 'Password must be at least 6 characters';
  }
  if (message.includes('invalid email')) {
    return 'Please enter a valid email address';
  }

  return error.message;
}
