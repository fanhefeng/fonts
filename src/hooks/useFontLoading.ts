import { useState, useEffect, useCallback } from 'react';

// 字体加载状态接口
export interface FontLoadingState {
  fontFamily: string;
  className: string;
  isLoaded: boolean;
  isLoading: boolean;
  error?: string;
  loadTime?: number; // 加载耗时（毫秒）
}

// 字体加载进度信息
export interface FontLoadingProgress {
  total: number;
  loaded: number;
  failed: number;
  loading: number;
  progress: number; // 0-100 的百分比
}

// 字体加载统计信息
export interface FontLoadingStats {
  totalFonts: number;
  successCount: number;
  failureCount: number;
  averageLoadTime: number;
  slowestFont?: {
    fontFamily: string;
    loadTime: number;
  };
  fastestFont?: {
    fontFamily: string;
    loadTime: number;
  };
}

/**
 * 字体加载状态管理 Hook
 * 提供全局字体加载状态、进度和错误信息
 * 与现有的 useFontLikes Hook 保持兼容
 */
export function useFontLoading() {
  const [fontStates, setFontStates] = useState<Map<string, FontLoadingState>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);

  // 监听字体加载事件
  useEffect(() => {
    const handleFontLoaded = (event: CustomEvent) => {
      const { fontClassName, loadTime } = event.detail;
      
      setFontStates(prev => {
        const newMap = new Map(prev);
        const currentState = newMap.get(fontClassName);
        if (currentState) {
          newMap.set(fontClassName, {
            ...currentState,
            isLoaded: true,
            isLoading: false,
            loadTime: loadTime || 0
          });
        }
        return newMap;
      });
    };

    const handleFontError = (event: CustomEvent) => {
      const { fontClassName, error } = event.detail;
      
      setFontStates(prev => {
        const newMap = new Map(prev);
        const currentState = newMap.get(fontClassName);
        if (currentState) {
          newMap.set(fontClassName, {
            ...currentState,
            isLoaded: false,
            isLoading: false,
            error: error
          });
        }
        return newMap;
      });
    };

    const handleFontLoadStart = (event: CustomEvent) => {
      const { fontClassName, fontFamily } = event.detail;
      
      setFontStates(prev => {
        const newMap = new Map(prev);
        newMap.set(fontClassName, {
          fontFamily,
          className: fontClassName,
          isLoaded: false,
          isLoading: true
        });
        return newMap;
      });
    };

    // 监听字体加载管理器初始化完成
    const handleFontManagerReady = () => {
      setIsInitialized(true);
    };

    // 添加事件监听器
    document.addEventListener('fontLoaded', handleFontLoaded as EventListener);
    document.addEventListener('fontError', handleFontError as EventListener);
    document.addEventListener('fontLoadStart', handleFontLoadStart as EventListener);
    document.addEventListener('fontManagerReady', handleFontManagerReady as EventListener);

    return () => {
      document.removeEventListener('fontLoaded', handleFontLoaded as EventListener);
      document.removeEventListener('fontError', handleFontError as EventListener);
      document.removeEventListener('fontLoadStart', handleFontLoadStart as EventListener);
      document.removeEventListener('fontManagerReady', handleFontManagerReady as EventListener);
    };
  }, []);

  // 获取字体加载进度
  const getProgress = useCallback((): FontLoadingProgress => {
    const states = Array.from(fontStates.values());
    const total = states.length;
    const loaded = states.filter(state => state.isLoaded).length;
    const failed = states.filter(state => state.error).length;
    const loading = states.filter(state => state.isLoading).length;
    const progress = total > 0 ? Math.round(((loaded + failed) / total) * 100) : 0;

    return {
      total,
      loaded,
      failed,
      loading,
      progress
    };
  }, [fontStates]);

  // 获取字体加载统计信息
  const getStats = useCallback((): FontLoadingStats => {
    const states = Array.from(fontStates.values());
    const successfulLoads = states.filter(state => state.isLoaded && state.loadTime);
    const loadTimes = successfulLoads.map(state => state.loadTime!);
    
    const averageLoadTime = loadTimes.length > 0 
      ? Math.round(loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length)
      : 0;

    let slowestFont, fastestFont;
    if (successfulLoads.length > 0) {
      const sortedByTime = [...successfulLoads].sort((a, b) => (b.loadTime || 0) - (a.loadTime || 0));
      slowestFont = {
        fontFamily: sortedByTime[0].fontFamily,
        loadTime: sortedByTime[0].loadTime || 0
      };
      fastestFont = {
        fontFamily: sortedByTime[sortedByTime.length - 1].fontFamily,
        loadTime: sortedByTime[sortedByTime.length - 1].loadTime || 0
      };
    }

    return {
      totalFonts: states.length,
      successCount: states.filter(state => state.isLoaded).length,
      failureCount: states.filter(state => state.error).length,
      averageLoadTime,
      slowestFont,
      fastestFont
    };
  }, [fontStates]);

  // 获取特定字体的加载状态
  const getFontState = useCallback((className: string): FontLoadingState | undefined => {
    return fontStates.get(className);
  }, [fontStates]);

  // 检查字体是否已加载
  const isFontLoaded = useCallback((className: string): boolean => {
    const state = fontStates.get(className);
    return state?.isLoaded || false;
  }, [fontStates]);

  // 检查字体是否正在加载
  const isFontLoading = useCallback((className: string): boolean => {
    const state = fontStates.get(className);
    return state?.isLoading || false;
  }, [fontStates]);

  // 获取字体加载错误
  const getFontError = useCallback((className: string): string | undefined => {
    const state = fontStates.get(className);
    return state?.error;
  }, [fontStates]);

  // 获取所有错误状态的字体
  const getErrorFonts = useCallback((): FontLoadingState[] => {
    return Array.from(fontStates.values()).filter(state => state.error);
  }, [fontStates]);

  // 获取所有已加载的字体
  const getLoadedFonts = useCallback((): FontLoadingState[] => {
    return Array.from(fontStates.values()).filter(state => state.isLoaded);
  }, [fontStates]);

  // 获取所有正在加载的字体
  const getLoadingFonts = useCallback((): FontLoadingState[] => {
    return Array.from(fontStates.values()).filter(state => state.isLoading);
  }, [fontStates]);

  // 检查是否所有字体都已完成加载（成功或失败）
  const isAllFontsProcessed = useCallback((): boolean => {
    const states = Array.from(fontStates.values());
    return states.length > 0 && states.every(state => !state.isLoading);
  }, [fontStates]);

  // 重新加载失败的字体
  const retryFailedFonts = useCallback(() => {
    const failedFonts = getErrorFonts();
    failedFonts.forEach(font => {
      // 触发重新加载事件
      const event = new CustomEvent('retryFontLoad', {
        detail: { fontClassName: font.className }
      });
      document.dispatchEvent(event);
    });
  }, [getErrorFonts]);

  return {
    // 状态数据
    fontStates: Array.from(fontStates.values()),
    isInitialized,
    
    // 进度和统计
    progress: getProgress(),
    stats: getStats(),
    
    // 查询方法
    getFontState,
    isFontLoaded,
    isFontLoading,
    getFontError,
    getErrorFonts,
    getLoadedFonts,
    getLoadingFonts,
    isAllFontsProcessed,
    
    // 操作方法
    retryFailedFonts
  };
}

/**
 * 简化版字体加载状态 Hook
 * 只提供基本的加载状态信息，适用于简单场景
 */
export function useSimpleFontLoading() {
  const { 
    progress, 
    isInitialized, 
    isAllFontsProcessed,
    getErrorFonts 
  } = useFontLoading();

  return {
    isLoading: !isAllFontsProcessed && isInitialized,
    progress: progress.progress,
    hasErrors: getErrorFonts().length > 0,
    errorCount: getErrorFonts().length
  };
}