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
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(currentTheme);
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
            colorPrimary: isDark ? '#1890ff' : '#1677ff',
            borderRadius: 6,
            colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
            colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
            colorBgLayout: isDark ? '#141414' : '#f5f5f5',
            colorBorder: isDark ? '#434343' : '#d9d9d9',
            colorText: isDark ? '#ffffff' : 'rgba(0, 0, 0, 0.88)',
            colorTextPlaceholder: isDark ? '#8c8c8c' : 'rgba(0, 0, 0, 0.45)',
          },
          components: {
            Button: {
              defaultBg: isDark ? '#1f1f1f' : '#f5f5f5',
              defaultColor: isDark ? '#1890ff' : '#1677ff',
              defaultBorderColor: isDark ? '#434343' : '#d9d9d9',
              defaultHoverBg: isDark ? '#262626' : '#e6f4ff',
              defaultHoverColor: isDark ? '#40a9ff' : '#0958d9',
              defaultHoverBorderColor: isDark ? '#595959' : '#40a9ff',
            },
            Input: {
              colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
              colorBorder: isDark ? '#434343' : '#d9d9d9',
              colorText: isDark ? '#ffffff' : 'rgba(0, 0, 0, 0.88)',
              colorTextPlaceholder: isDark ? '#8c8c8c' : 'rgba(0, 0, 0, 0.45)',
            },
            Card: {
              colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
              colorBorderSecondary: isDark ? '#434343' : '#d9d9d9',
            },
            Select: {
              colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
              colorBorder: isDark ? '#434343' : '#d9d9d9',
              colorText: isDark ? '#ffffff' : 'rgba(0, 0, 0, 0.88)',
              colorTextPlaceholder: isDark ? '#8c8c8c' : 'rgba(0, 0, 0, 0.45)',
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};