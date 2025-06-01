import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isPublicPage: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // Check if current page is a public page that should use light theme
  const isPublicPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);
  
  const [theme, setThemeState] = useState<Theme>(() => {
    // Force light theme for public pages
    if (isPublicPage) {
      return 'light';
    }
    
    // Check localStorage first for other pages
    const savedTheme = localStorage.getItem('theme') as Theme;
    // Then check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    return (savedTheme || (prefersDark ? 'dark' : 'light')) as Theme;
  });

  useEffect(() => {
    // Force light theme for public pages
    if (isPublicPage) {
      document.documentElement.classList.remove('dark');
      return;
    }

    // Update localStorage for non-public pages
    localStorage.setItem('theme', theme);
    
    // Handle system theme
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Update document class for light/dark themes
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme, isPublicPage]);

  // Update theme when navigating between public and private pages
  useEffect(() => {
    if (isPublicPage) {
      setThemeState('light');
    } else {
      // Restore saved theme when leaving public pages
      const savedTheme = localStorage.getItem('theme') as Theme;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState(savedTheme || (prefersDark ? 'dark' : 'light'));
    }
  }, [isPublicPage]);

  const toggleTheme = () => {
    // Prevent theme toggle on public pages
    if (isPublicPage) return;
    
    setThemeState(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    // Prevent theme change on public pages
    if (isPublicPage) return;
    
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: isPublicPage ? 'light' : theme, toggleTheme, setTheme, isPublicPage }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
