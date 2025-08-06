import { FontVariantInfo } from '@/types/global';

/**
 * 查找最接近的权重值
 * @param availableWeights 可用的权重数组
 * @param targetWeight 目标权重
 * @returns 最接近的权重值
 */
export function findClosestWeight(availableWeights: number[], targetWeight: number): number {
  if (availableWeights.length === 0) return 400; // 默认值
  
  // 如果目标权重在可用权重中，直接返回
  if (availableWeights.includes(targetWeight)) {
    return targetWeight;
  }
  
  // 找到最接近的权重
  let closest = availableWeights[0];
  let minDiff = Math.abs(targetWeight - closest);
  
  for (const weight of availableWeights) {
    const diff = Math.abs(targetWeight - weight);
    if (diff < minDiff) {
      minDiff = diff;
      closest = weight;
    }
  }
  
  return closest;
}

/**
 * 检查字体是否支持斜体样式
 * @param availableStyles 可用的样式数组
 * @param targetStyle 目标样式 
 * @returns 支持的样式
 */
export function findAvailableStyle(availableStyles: string[], targetStyle: string): string {
  if (availableStyles.length === 0) return 'normal'; // 默认值
  
  // 如果目标样式在可用样式中，直接返回
  if (availableStyles.includes(targetStyle)) {
    return targetStyle;
  }
  
  // 如果不支持斜体，返回normal
  if (targetStyle === 'italic' && !availableStyles.includes('italic')) {
    return 'normal';
  }
  
  // 默认返回第一个可用样式
  return availableStyles[0];
}

/**
 * 根据字体变体信息过滤并调整权重选项
 * @param fontVariants 字体变体信息
 * @param language 语言设置
 * @returns 过滤后的权重选项配置
 */
export function getAvailableWeightMarks(fontVariants: FontVariantInfo | undefined, language: string) {
  if (!fontVariants) {
    // 如果没有变体信息，返回默认的权重配置
    return {
      min: 100,
      max: 900,
      step: 100,
      marks: language === 'zh' ? {
        100: '极细',
        200: '特细',
        300: '细',
        400: '正常',
        500: '中等',
        600: '中粗',
        700: '粗',
        800: '特粗',
        900: '超粗',
      } : {
        100: 'Thin',
        200: 'ExtraLight',
        300: 'Light',
        400: 'Regular',
        500: 'Medium',
        600: 'SemiBold',
        700: 'Bold',
        800: 'ExtraBold',
        900: 'Black',
      }
    };
  }

  const weights = fontVariants.weights.sort((a, b) => a - b);
  const min = weights[0];
  const max = weights[weights.length - 1];

  // 创建只包含可用权重的标记
  const weightNameMap = language === 'zh' ? {
    100: '极细',
    200: '特细', 
    300: '细',
    400: '正常',
    500: '中等',
    600: '中粗',
    700: '粗',
    800: '特粗',
    900: '超粗',
  } : {
    100: 'Thin',
    200: 'ExtraLight',
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'SemiBold',
    700: 'Bold',
    800: 'ExtraBold',
    900: 'Black',
  };

  // 创建简短标记映射
  const shortWeightNameMap = language === 'zh' ? {
    100: '极细',
    200: '特细',
    300: '细', 
    400: '正常',
    500: '中等',
    600: '中粗',
    700: '粗',
    800: '特粗',
    900: '超粗',
  } : {
    100: 'Thin',
    200: 'XLight',
    300: 'Light', 
    400: 'Reg',
    500: 'Med',
    600: 'SBold',
    700: 'Bold',
    800: 'XBold',
    900: 'Black',
  };

  const marks: { [key: number]: string } = {};
  const shortMarks: { [key: number]: string } = {};
  
  weights.forEach(weight => {
    // 完整标记
    if (weightNameMap[weight as keyof typeof weightNameMap]) {
      marks[weight] = weightNameMap[weight as keyof typeof weightNameMap];
    } else {
      marks[weight] = weight.toString();
    }
    
    // 简短标记
    if (shortWeightNameMap[weight as keyof typeof shortWeightNameMap]) {
      shortMarks[weight] = shortWeightNameMap[weight as keyof typeof shortWeightNameMap];
    } else {
      shortMarks[weight] = weight.toString();
    }
  });

  return {
    min,
    max,
    step: null, // 不使用固定步长，只允许选择可用的权重
    marks,
    shortMarks, // 添加简短标记
    availableWeights: weights
  };
}

/**
 * 检查字体是否支持斜体
 * @param fontVariants 字体变体信息
 * @returns 是否支持斜体
 */
export function supportsItalic(fontVariants: FontVariantInfo | undefined): boolean {
  if (!fontVariants) return true; // 默认假设支持
  return fontVariants.styles.includes('italic');
}

/**
 * 检查字体是否支持正常样式
 * @param fontVariants 字体变体信息
 * @returns 是否支持正常样式
 */
export function supportsNormal(fontVariants: FontVariantInfo | undefined): boolean {
  if (!fontVariants) return true; // 默认假设支持
  return fontVariants.styles.includes('normal');
}

/**
 * 获取字体的唯一可用样式（当只有一种样式时）
 * @param fontVariants 字体变体信息
 * @returns 唯一可用样式，如果有多种样式则返回null
 */
export function getOnlyAvailableStyle(fontVariants: FontVariantInfo | undefined): 'normal' | 'italic' | null {
  if (!fontVariants || fontVariants.styles.length !== 1) return null;
  return fontVariants.styles[0] as 'normal' | 'italic';
}

/**
 * 获取字体名称（从className中提取）
 * @param fontClassName 字体类名
 * @returns 字体名称
 */
export function getFontNameFromClassName(fontClassName: string): string {
  // 假设字体类名格式类似 "__className_b462dc"，我们需要从font对象中获取实际名称
  // 这个函数可能需要根据实际的字体对象结构进行调整
  return fontClassName;
}

/**
 * 创建只包含可用权重的Slider配置
 * @param availableWeights 可用权重数组
 * @param currentWeight 当前权重
 * @param language 语言
 * @returns Slider配置对象
 */
export function createWeightSliderConfig(
  availableWeights: number[], 
  currentWeight: number,
  language: string
) {
  if (availableWeights.length === 0) {
    return getAvailableWeightMarks(undefined, language);
  }

  const sortedWeights = [...availableWeights].sort((a, b) => a - b);
  const weightConfig = getAvailableWeightMarks(
    {
      totalVariants: availableWeights.length,
      weights: sortedWeights,
      styles: ['normal'], // 这里不重要，主要用于权重
      variants: []
    },
    language
  );

  // 决定使用完整标记还是简短标记
  const shouldUseShortMarks = availableWeights.length > 4; // 超过4个权重时使用简短标记

  return {
    ...weightConfig,
    marks: shouldUseShortMarks ? weightConfig.shortMarks : weightConfig.marks,
    useShortMarks: shouldUseShortMarks,
    value: findClosestWeight(availableWeights, currentWeight)
  };
}