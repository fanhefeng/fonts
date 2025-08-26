// 字体加载工具函数

export interface FontLoadOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// 创建字体加载Promise
export const createFontLoadPromise = (
  fontFamily: string, 
  fontVariable: string,
  options: FontLoadOptions = {}
): Promise<void> => {
  const { 
    timeout = 5000, 
    retries = 2, 
    retryDelay = 1000 
  } = options;

  return new Promise((resolve, reject) => {
    let attemptCount = 0;

    const attemptLoad = () => {
      attemptCount++;
      
      const timeoutId = setTimeout(() => {
        if (attemptCount <= retries) {
          console.warn(`字体加载超时，重试 ${attemptCount}/${retries}: ${fontFamily}`);
          setTimeout(attemptLoad, retryDelay * attemptCount); // 指数退避
        } else {
          reject(new Error(`字体加载超时 (${timeout}ms)`));
        }
      }, timeout);

      // 检查字体是否已经可用
      const checkFontLoaded = (): boolean => {
        try {
          return document.fonts.check(`16px "${fontFamily}"`);
        } catch {
          return false;
        }
      };

      // 立即检查一次
      if (checkFontLoaded()) {
        clearTimeout(timeoutId);
        resolve();
        return;
      }

      // 创建字体加载检测器
      const fontLoadDetector = () => {
        if (checkFontLoaded()) {
          clearTimeout(timeoutId);
          resolve();
          return true;
        }
        return false;
      };

      // 监听字体加载完成事件
      const handleFontLoadingDone = () => {
        if (fontLoadDetector()) {
          document.fonts.removeEventListener('loadingdone', handleFontLoadingDone);
        }
      };

      document.fonts.addEventListener('loadingdone', handleFontLoadingDone);

      // 强制触发字体加载
      triggerFontLoad(fontFamily, fontVariable);

      // 定期检查字体是否已加载（备用方案）
      const checkInterval = setInterval(() => {
        if (fontLoadDetector()) {
          clearInterval(checkInterval);
          clearTimeout(timeoutId);
          document.fonts.removeEventListener('loadingdone', handleFontLoadingDone);
        }
      }, 100);

      // 清理定时器
      setTimeout(() => {
        clearInterval(checkInterval);
        document.fonts.removeEventListener('loadingdone', handleFontLoadingDone);
      }, timeout);
    };

    attemptLoad();
  });
};

// 强制触发字体加载
const triggerFontLoad = (fontFamily: string, fontVariable: string) => {
  console.log(`🔄 尝试触发字体加载: ${fontFamily} (${fontVariable})`);
  
  // 方法1: 创建隐藏的测试元素来触发字体加载
  const testElement = document.createElement('div');
  testElement.style.fontFamily = `var(${fontVariable}), var(--font-chinese-fallback)`;
  testElement.style.position = 'absolute';
  testElement.style.visibility = 'hidden';
  testElement.style.fontSize = '16px';
  testElement.style.left = '-9999px';
  testElement.style.top = '-9999px';
  testElement.textContent = 'Font loading test 字体加载测试 1234567890 ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz';
  
  document.body.appendChild(testElement);

  // 方法2: 尝试使用 FontFace API 手动加载字体
  try {
    // 从 CSS 变量中提取字体 URL
    const computedStyle = getComputedStyle(document.documentElement);
    const fontUrl = computedStyle.getPropertyValue(fontVariable);
    
    if (fontUrl && fontUrl.includes('url(')) {
      console.log(`📥 尝试使用 FontFace API 加载: ${fontFamily}`);
      const fontFace = new FontFace(fontFamily, fontUrl);
      fontFace.load().then(() => {
        console.log(`✅ FontFace API 加载成功: ${fontFamily}`);
        document.fonts.add(fontFace);
      }).catch(error => {
        console.warn(`❌ FontFace API 加载失败: ${fontFamily}`, error);
      });
    }
  } catch (error) {
    console.warn(`⚠️ FontFace API 不可用或出错: ${fontFamily}`, error);
  }

  // 短暂延迟后移除测试元素
  setTimeout(() => {
    if (testElement.parentNode) {
      testElement.parentNode.removeChild(testElement);
    }
  }, 1000);
};

// 检查字体是否已加载
export const isFontLoaded = (fontFamily: string): boolean => {
  try {
    return document.fonts.check(`16px "${fontFamily}"`);
  } catch (error) {
    console.warn(`检查字体状态失败: ${fontFamily}`, error);
    return false;
  }
};

// 等待字体加载完成
export const waitForFont = (fontFamily: string, timeout: number = 5000): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isFontLoaded(fontFamily)) {
      resolve(true);
      return;
    }

    const timeoutId = setTimeout(() => {
      resolve(false);
    }, timeout);

    const checkFont = () => {
      if (isFontLoaded(fontFamily)) {
        clearTimeout(timeoutId);
        resolve(true);
        return;
      }
      requestAnimationFrame(checkFont);
    };

    checkFont();
  });
};

// 批量加载字体
export const loadFonts = async (
  fonts: Array<{ family: string; variable: string }>,
  options: FontLoadOptions = {}
): Promise<{ loaded: string[]; failed: Array<{ family: string; error: string }> }> => {
  const results = await Promise.allSettled(
    fonts.map(font => 
      createFontLoadPromise(font.family, font.variable, options)
        .then(() => ({ family: font.family, success: true }))
        .catch(error => ({ family: font.family, success: false, error: error.message }))
    )
  );

  const loaded: string[] = [];
  const failed: Array<{ family: string; error: string }> = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const value = result.value;
      if (value.success) {
        loaded.push(value.family);
      } else {
        failed.push({ 
          family: value.family, 
          error: 'error' in value ? value.error : '未知错误' 
        });
      }
    } else {
      failed.push({ 
        family: fonts[index].family, 
        error: result.reason?.message || '加载失败' 
      });
    }
  });

  return { loaded, failed };
};