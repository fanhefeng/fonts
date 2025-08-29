import React, { createContext, useContext, useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('font-showcase-theme') as Theme;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Save theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem('font-showcase-theme', currentTheme);
    // Update document class for CSS
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isDark = currentTheme === 'dark';

  const value: ThemeContextType = {
    theme: currentTheme,
    toggleTheme,
    isDark
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: isDark ? '#6799FE' : '#4470FE',
            borderRadius: 8,
            colorBgContainer: isDark ? '#292929' : '#FFFFFF',
            colorBgElevated: isDark ? '#292929' : '#FFFFFF',
            colorBgLayout: isDark ? '#0F0F0F' : '#FFFFFF',
            colorBorder: isDark ? '#404040' : '#e5e7eb',
            colorText: isDark ? '#f0f6fc' : '#24292e',
            colorTextPlaceholder: isDark ? '#8E9094' : '#A2A3A5',
          },
          components: {
            Button: {
              defaultBg: isDark ? '#283042' : '#EDF3FE',
              defaultColor: isDark ? '#6799FE' : '#4470FE',
              defaultBorderColor: isDark ? '#283042' : '#EDF3FE',
              defaultHoverBg: isDark ? '#364663' : '#dce7fd',
              defaultHoverColor: isDark ? '#7ba3ff' : '#3d66fe',
              defaultHoverBorderColor: isDark ? '#364663' : '#dce7fd',
            },
            Input: {
              colorBgContainer: isDark ? '#292929' : '#FFFFFF',
              colorBorder: isDark ? '#404040' : '#e5e7eb',
              colorText: isDark ? '#f0f6fc' : '#24292e',
              colorTextPlaceholder: isDark ? '#8E9094' : '#A2A3A5',
            },
            Card: {
              colorBgContainer: isDark ? '#292929' : '#FFFFFF',
              colorBorderSecondary: isDark ? '#404040' : '#e5e7eb',
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};