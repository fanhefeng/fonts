import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'zh' | 'en';

interface Translations {
  header: {
    title: string;
    subtitle: string;
  };
  search: {
    placeholder: string;
    favorites: string;
    showAll: string;
    reset: string;
  };
  controls: {
    globalText: string;
    globalTextPlaceholder: string;
    globalSettings: string;
    fontSize: string;
    fontWeight: string;
    fontStyle: string;
    fontColor: string;
    normal: string;
    commonColors: string;
    thin: string;
    regular: string;
    bold: string;
    extraBold: string;
  };
  font: {
    textSamples: string;
    testSentence: string;
    alphabet: string;
    chinese: string;
    custom: string;
    customPlaceholder: string;
    globalTextUsed: string;
    individualSettings: string;
    reset: string;
    favorite: string;
    unfavorite: string;
    download: string;
  };
  stats: {
    showing: string;
    fonts: string;
    favorited: string;
  };
  empty: {
    noFavorites: string;
    noResults: string;
    noFavoritesDesc: string;
    noResultsDesc: string;
  };
  theme: {
    light: string;
    dark: string;
  };
  loading: string;
}

const translations: Record<Language, Translations> = {
  zh: {
    header: {
      title: 'Fonts',
      subtitle: '仅供分享，谢绝商用！'
    },
    search: {
      placeholder: '🔍 搜索字体名称...',
      favorites: '仅收藏',
      showAll: '显示全部',
      reset: '重置'
    },
    controls: {
      globalText: '📝 全局预览文本',
      globalTextPlaceholder: '输入要在所有字体中预览的文本...留空使用默认示例',
      globalSettings: '⚙️ 全局样式设置',
      fontSize: '字体大小',
      fontWeight: '字体粗细',
      fontStyle: '字体样式',
      fontColor: '字体颜色',
      normal: '正常',
      commonColors: '常用颜色',
      thin: '细',
      regular: '正常',
      bold: '粗',
      extraBold: '超粗'
    },
    font: {
      textSamples: '文本样式:',
      testSentence: '测试句',
      alphabet: '字母表',
      chinese: '中文',
      custom: '自定义',
      customPlaceholder: '输入您想要预览的文本...',
      globalTextUsed: '使用全局文本',
      individualSettings: '个别字体设置',
      reset: '重置',
      favorite: '收藏',
      unfavorite: '取消收藏',
      download: '下载字体'
    },
    stats: {
      showing: '显示',
      fonts: '个字体',
      favorited: '已收藏'
    },
    empty: {
      noFavorites: '还没有收藏的字体',
      noResults: '没有找到匹配的字体',
      noFavoritesDesc: '点击字体卡片上的心形图标来收藏您喜欢的字体',
      noResultsDesc: '尝试调整搜索条件或浏览所有可用字体'
    },
    theme: {
      light: '浅色模式',
      dark: '深色模式'
    },
    loading: '正在加载字体数据...'
  },
  en: {
    header: {
      title: 'Fonts',
      subtitle: 'For sharing only, commercial use prohibited!'
    },
    search: {
      placeholder: '🔍 Search font names...',
      favorites: 'Favorites Only',
      showAll: 'Show All',
      reset: 'Reset'
    },
    controls: {
      globalText: '📝 Global Preview Text',
      globalTextPlaceholder: 'Enter text to preview in all fonts... leave empty for default samples',
      globalSettings: '⚙️ Global Style Settings',
      fontSize: 'Font Size',
      fontWeight: 'Font Weight',
      fontStyle: 'Font Style',
      fontColor: 'Font Color',
      normal: 'Normal',
      commonColors: 'Common Colors',
      thin: 'Thin',
      regular: 'Regular',
      bold: 'Bold',
      extraBold: 'Extra Bold'
    },
    font: {
      textSamples: 'Text Style:',
      testSentence: 'Test Sentence',
      alphabet: 'Alphabet',
      chinese: 'Chinese',
      custom: 'Custom',
      customPlaceholder: 'Enter text you want to preview...',
      globalTextUsed: 'Using Global Text',
      individualSettings: 'Individual Font Settings',
      reset: 'Reset',
      favorite: 'Favorite',
      unfavorite: 'Unfavorite',
      download: 'Download Font'
    },
    stats: {
      showing: 'Showing',
      fonts: 'fonts',
      favorited: 'favorited'
    },
    empty: {
      noFavorites: 'No favorite fonts yet',
      noResults: 'No matching fonts found',
      noFavoritesDesc: 'Click the heart icon on font cards to favorite fonts you like',
      noResultsDesc: 'Try adjusting your search criteria or browse all available fonts'
    },
    theme: {
      light: 'Light Mode',
      dark: 'Dark Mode'
    },
    loading: 'Loading font data...'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('font-showcase-language') as Language;
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('zh')) {
        setLanguage('zh');
      } else {
        setLanguage('en');
      }
    }
  }, []);

  // Save language to localStorage when changed
  useEffect(() => {
    localStorage.setItem('font-showcase-language', language);
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};