import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, formatAuthError } from '../../services/auth.service';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  studyGoal?: string;
  joinDate: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile from database
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    const { profile, error } = await authService.getUserProfile(supabaseUser.id);

    if (error || !profile) {
      console.error('Error loading user profile:', error);
      return;
    }

    const userData: User = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar_url || undefined,
      bio: profile.bio || undefined,
      studyGoal: profile.study_goal || undefined,
      joinDate: new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    };

    setUser(userData);
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    const { user: supabaseUser, error } = await authService.signIn({ email, password });

    if (error) {
      throw new Error(formatAuthError(error));
    }

    if (supabaseUser) {
      await loadUserProfile(supabaseUser);
    }
  };

  // Sign up with name, email, and password
  const signUp = async (name: string, email: string, password: string) => {
    console.log('Name: ', name, email);
    const { user: supabaseUser, error } = await authService.signUp({ name, email, password });

    if (error) {
      throw new Error(formatAuthError(error));
    }

    if (supabaseUser) {
      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      await loadUserProfile(supabaseUser);
    }
  };

  // Sign out
  const signOut = async () => {
    const { error } = await authService.signOut();

    if (error) {
      console.error('Error signing out:', error);
      throw new Error(formatAuthError(error));
    }

    setUser(null);
  };

  // Update user profile
  const updateUser = async (data: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    const updateData: Record<string, string | undefined> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.avatar !== undefined) updateData.avatar_url = data.avatar;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.studyGoal !== undefined) updateData.study_goal = data.studyGoal;

    const { error } = await authService.updateProfile(user.id, updateData);

    if (error) {
      throw new Error(formatAuthError(error));
    }

    // Update local state
    setUser({
      ...user,
      ...data,
    });
  };

  // Initialize auth state on mount
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const session = await authService.getSession();

        if (session?.user && mounted) {
          await loadUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        await loadUserProfile(session.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
