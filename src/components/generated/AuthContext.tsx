import React, { createContext, useContext, useState, ReactNode } from 'react';
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate: string;
}
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateUser: (data: Partial<User>) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
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
export const AuthProvider = ({
  children
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const signIn = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user data - in real app, this would come from your backend
    const mockUser: User = {
      id: '1',
      name: 'Jake Anderson',
      email: email,
      joinDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };
  const signUp = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user data - in real app, this would come from your backend
    const mockUser: User = {
      id: Date.now().toString(),
      name: name,
      email: email,
      joinDate: new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      })
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };
  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = {
        ...user,
        ...data
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Check for stored user on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('user');
      }
    }
  }, []);
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateUser
  };
  return <AuthContext.Provider value={value} data-magicpath-id="0" data-magicpath-path="AuthContext.tsx">{children}</AuthContext.Provider>;
};