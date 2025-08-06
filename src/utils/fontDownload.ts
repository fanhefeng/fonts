import { NextFontWithVariableWithLiked, FontVariantInfo } from '@/types/global';

// Extract font name from className
export const getFontName = (className: string): string => {
  // Remove the font prefix and convert to readable name
  return className.replace('font-', '').replace(/([A-Z])/g, ' $1').trim();
};

/**
 * 根据字体变体信息查找最匹配的字体文件
 * @param fontVariants 字体变体信息
 * @param targetWeight 目标权重
 * @param targetStyle 目标样式 ('normal' 或 'italic')
 * @returns 匹配的变体信息，如果没找到返回 null
 */
export const findMatchingVariant = (
  fontVariants: FontVariantInfo | undefined, 
  targetWeight: number, 
  targetStyle: 'normal' | 'italic'
) => {
  if (!fontVariants || fontVariants.variants.length === 0) {
    return null;
  }

  // 首先尝试精确匹配权重和样式
  const exactMatch = fontVariants.variants.find(
    v => v.weight === targetWeight && v.style === targetStyle
  );

  if (exactMatch) {
    return exactMatch;
  }

  // 如果没有精确匹配，找到最接近权重的相同样式
  const sameStyleVariants = fontVariants.variants.filter(v => v.style === targetStyle);
  
  if (sameStyleVariants.length > 0) {
    // 找到最接近的权重
    let closest = sameStyleVariants[0];
    let minDiff = Math.abs(targetWeight - closest.weight);
    
    for (const variant of sameStyleVariants) {
      const diff = Math.abs(targetWeight - variant.weight);
      if (diff < minDiff) {
        minDiff = diff;
        closest = variant;
      }
    }
    return closest;
  }

  // 如果目标样式不存在，但有normal样式，使用normal样式的最接近权重
  if (targetStyle === 'italic') {
    const normalVariants = fontVariants.variants.filter(v => v.style === 'normal');
    if (normalVariants.length > 0) {
      let closest = normalVariants[0];
      let minDiff = Math.abs(targetWeight - closest.weight);
      
      for (const variant of normalVariants) {
        const diff = Math.abs(targetWeight - variant.weight);
        if (diff < minDiff) {
          minDiff = diff;
          closest = variant;
        }
      }
      return closest;
    }
  }

  // 最后的兜底：返回第一个变体
  return fontVariants.variants[0];
};

/**
 * 生成字体文件路径
 * @param fontFamilyName 字体族名称
 * @param variant 字体变体信息
 * @returns 字体文件路径
 */
export const generateFontPath = (fontFamilyName: string, variant: { weight: number; style: string; file: string }): string => {
  return `/fonts/${fontFamilyName}/${variant.file}`;
};

// Download a font file with dynamic font information
export const downloadFontFile = async (
  font: NextFontWithVariableWithLiked, 
  extension: string = 'ttf', 
  targetWeight: number = 400,
  targetStyle: 'normal' | 'italic' = 'normal',
  fontVariants?: FontVariantInfo
): Promise<boolean> => {
  try {
    const fontFamilyName = font.style.fontFamily.split(',')[0].slice(1, -1);
    let fontPath = '';
    
    // 优先使用字体变体信息来确定文件路径
    if (fontVariants) {
      const matchingVariant = findMatchingVariant(fontVariants, targetWeight, targetStyle);
      
      if (matchingVariant) {
        fontPath = generateFontPath(fontFamilyName, matchingVariant);
      }
    }

    // 如果没有变体信息或没找到匹配的变体，尝试从字体定义的src中获取
    if (!fontPath && 'src' in font) {
      const src = font.src as string | { path: string; weight?: string; style?: string }[];
      
      if (typeof src === 'string') {
        fontPath = src;
      } else if (Array.isArray(src) && src.length > 0) {
        // 尝试找到权重和样式都匹配的文件
        const exactMatch = src.find((s: { path?: string; weight?: string; style?: string }) => 
          s.weight && parseInt(s.weight) === targetWeight && 
          s.style === targetStyle
        );
        
        if (exactMatch?.path) {
          fontPath = exactMatch.path;
        } else {
          // 尝试找到权重匹配、样式为normal的文件
          const weightMatch = src.find((s: { path?: string; weight?: string; style?: string }) => 
            s.weight && parseInt(s.weight) === targetWeight
          );
          
          if (weightMatch?.path) {
            fontPath = weightMatch.path;
          } else {
            // 找到最接近权重的文件
            let closestWeight = src[0];
            let minDiff = Math.abs(targetWeight - parseInt(src[0].weight || '400'));
            
            for (const s of src) {
              if (s.weight) {
                const diff = Math.abs(targetWeight - parseInt(s.weight));
                if (diff < minDiff) {
                  minDiff = diff;
                  closestWeight = s;
                }
              }
            }
            
            fontPath = closestWeight.path || src[0].path;
          }
        }
      }
    }

    // 最后的兜底：使用传统的路径映射方式
    if (!fontPath) {
      const weightMapping: { [key: number]: string } = {
        100: 'Thin',
        200: 'UltraLight', 
        300: 'Light',
        400: 'Regular',
        500: 'Medium',
        600: 'SemiBold',
        700: 'Bold',
        800: 'ExtraBold',
        900: 'Black'
      };

      const weightName = weightMapping[targetWeight] || 'Regular';
      const styleSuffix = targetStyle === 'italic' ? '-Italic' : '';
      
      // 生成标准化的文件路径
      fontPath = `/fonts/${fontFamilyName}/${fontFamilyName}-${weightName}${styleSuffix}.${extension}`;
    } else {
      // 转换相对路径为公共URL路径
      if (fontPath.startsWith('../public/fonts/')) {
        fontPath = fontPath.replace('../public', '');
      } else if (fontPath.startsWith('./fonts/')) {
        fontPath = fontPath.replace('.', '');
      } else if (fontPath.startsWith('../')) {
        fontPath = '/fonts' + fontPath.substring(2);
      } else if (!fontPath.startsWith('/')) {
        fontPath = '/fonts/' + fontPath;
      }
    }
    
    // 获取字体文件
    const response = await fetch(fontPath);
    if (!response.ok) {
      // 如果指定权重/样式的文件未找到，尝试使用默认样式
      if (targetStyle === 'italic') {
        return await downloadFontFile(font, extension, targetWeight, 'normal', fontVariants);
      } else if (targetWeight !== 400) {
        return await downloadFontFile(font, extension, 400, targetStyle, fontVariants);
      }
      throw new Error(`Failed to fetch font file: ${response.statusText}`);
    }

    // 获取文件blob
    const blob = await response.blob();
    
    // 创建下载文件名
    const fileName = fontPath.split('/').pop() || `${fontFamilyName}-${targetWeight}${targetStyle === 'italic' ? '-Italic' : ''}.${extension}`;
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // 触发下载
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (downloadError) {
    console.error('Font download failed:', downloadError);
    throw new Error(`Failed to download font: ${downloadError instanceof Error ? downloadError.message : 'Unknown error'}`);
  }
};

// Get available font files for a font (legacy function, kept for compatibility)
export const getFontFiles = (font: NextFontWithVariableWithLiked) => {
  // Try to extract extensions from the font source
  if ('src' in font) {
    const src = font.src as string | { path: string }[];
    if (Array.isArray(src)) {
      const extensions = src.map((s: { path: string }) => {
        const ext = s.path?.split('.').pop();
        return ext || 'ttf';
      });
      return [...new Set(extensions)]; // Remove duplicates
    } else if (typeof src === 'string') {
      const ext = src.split('.').pop();
      return [ext || 'ttf'];
    }
  }
  
  // Default fallback
  return ['ttf'];
};

// Download all variants of a font family
export const downloadFontFamily = async (font: NextFontWithVariableWithLiked, fontVariants?: FontVariantInfo) => {
  if (fontVariants && fontVariants.variants.length > 0) {
    // Download all available variants
    const downloadPromises = fontVariants.variants.map(variant => 
      downloadFontFile(font, 'ttf', variant.weight, variant.style as 'normal' | 'italic', fontVariants)
    );
    
    try {
      await Promise.all(downloadPromises);
      return true;
    } catch {
      // If bulk download fails, try individual downloads
      for (const variant of fontVariants.variants) {
        try {
          await downloadFontFile(font, 'ttf', variant.weight, variant.style as 'normal' | 'italic', fontVariants);
        } catch (e) {
          console.warn(`Failed to download ${variant.weight} ${variant.style} variant:`, e);
        }
      }
      return true;
    }
  } else {
    // Fallback to original implementation
    const extensions = getFontFiles(font);
    const downloadPromises = extensions.map(ext => downloadFontFile(font, ext));
    
    try {
      await Promise.all(downloadPromises);
      return true;
    } catch {
      // If bulk download fails, try individual downloads
      for (const ext of extensions) {
        try {
          await downloadFontFile(font, ext);
        } catch (e) {
          console.warn(`Failed to download ${ext} variant:`, e);
        }
      }
      return true;
    }
  }
};