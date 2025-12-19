import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface User {
  username: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string, email?: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize demo users if they don't exist
    const existingUsers = localStorage.getItem('shiptrack_users');
    if (!existingUsers) {
      const demoUsers = [
        { username: 'demo1', password: 'demo1', email: 'demo1@example.com' },
        { username: 'demo2', password: 'demo2', email: 'demo2@example.com' }
      ];
      localStorage.setItem('shiptrack_users', JSON.stringify(demoUsers));
    }

    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('shiptrack_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('shiptrack_user');
      }
    }
  }, []);

  const register = (username: string, password: string, email?: string): boolean => {
    if (!username || !password) {
      toast({
        title: "Registration Failed",
        description: "Username and password are required",
        variant: "destructive"
      });
      return false;
    }

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('shiptrack_users') || '[]');
    if (existingUsers.find((u: any) => u.username === username)) {
      toast({
        title: "Registration Failed",
        description: "Username already exists",
        variant: "destructive"
      });
      return false;
    }

    // Save new user
    const newUser = { username, password, email };
    existingUsers.push(newUser);
    localStorage.setItem('shiptrack_users', JSON.stringify(existingUsers));

    // Auto login
    const userProfile = { username, email };
    setUser(userProfile);
    localStorage.setItem('shiptrack_user', JSON.stringify(userProfile));

    toast({
      title: "Registration Successful",
      description: `Welcome ${username}!`
    });
    return true;
  };

  const login = (username: string, password: string): boolean => {
    if (!username || !password) {
      toast({
        title: "Login Failed",
        description: "Username and password are required",
        variant: "destructive"
      });
      return false;
    }

    const existingUsers = JSON.parse(localStorage.getItem('shiptrack_users') || '[]');
    const foundUser = existingUsers.find((u: any) => u.username === username && u.password === password);

    if (foundUser) {
      const userProfile = { username: foundUser.username, email: foundUser.email };
      setUser(userProfile);
      localStorage.setItem('shiptrack_user', JSON.stringify(userProfile));
      
      toast({
        title: "Login Successful",
        description: `Welcome back ${username}!`
      });
      return true;
    }

    toast({
      title: "Login Failed",
      description: "Invalid username or password",
      variant: "destructive"
    });
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shiptrack_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};