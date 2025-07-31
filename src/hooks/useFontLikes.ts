import { useState, useEffect } from 'react';

type FontLikeData = {
  [className: string]: boolean;
};

export function useFontLikes() {
  const [likes, setLikes] = useState<FontLikeData>({});
  const [isLoaded, setIsLoaded] = useState(false);

  const STORAGE_KEY = 'font-showcase-likes';

  // 从 localStorage 加载收藏数据
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setLikes(parsed);
      }
    } catch (error) {
      console.warn('Failed to load font likes from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 保存到 localStorage
  const saveLikes = (newLikes: FontLikeData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLikes));
      setLikes(newLikes);
    } catch (error) {
      console.error('Failed to save font likes to localStorage:', error);
      // 即使保存失败，也更新内存中的状态
      setLikes(newLikes);
    }
  };

  // 切换收藏状态
  const toggleLike = (className: string) => {
    const newLikes = {
      ...likes,
      [className]: !likes[className]
    };
    saveLikes(newLikes);
  };

  // 获取收藏状态
  const isLiked = (className: string): boolean => {
    return likes[className] || false;
  };

  // 获取所有收藏的字体类名
  const getLikedFonts = (): string[] => {
    return Object.keys(likes).filter(className => likes[className]);
  };

  // 清除所有收藏
  const clearAllLikes = () => {
    saveLikes({});
  };

  // 获取收藏数量
  const getLikeCount = (): number => {
    return Object.values(likes).filter(Boolean).length;
  };

  return {
    isLoaded,
    toggleLike,
    isLiked,
    getLikedFonts,
    clearAllLikes,
    getLikeCount,
    likes
  };
}