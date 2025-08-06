// 示例：如何使用字体变体信息
import { RobotoMono, RobotoMonoVariants, fontVariantsMap, FontVariantInfo } from './styles/fonts';

// 获取特定字体的变体信息
console.log('RobotoMono 变体信息:', RobotoMonoVariants);

// 从映射中获取字体变体信息
const robotoVariants = fontVariantsMap['RobotoMono'];
console.log('可用权重:', robotoVariants.weights); // [100, 200, 300, 400, 500, 600, 700]
console.log('可用样式:', robotoVariants.styles); // ["italic", "normal"]
console.log('变体总数:', robotoVariants.totalVariants); // 14

// 查找特定权重和样式的变体
function findVariant(fontVariants: FontVariantInfo, weight: number, style: string) {
  return fontVariants.variants.find(v => v.weight === weight && v.style === style);
}

const boldItalic = findVariant(RobotoMonoVariants, 700, 'italic');
console.log('Bold Italic 变体:', boldItalic);
// 输出: { weight: 700, style: "italic", file: "RobotoMono-Bold-Italic.ttf" }

// 获取所有可用的字体族及其变体信息
function getAllFontsInfo() {
  return Object.entries(fontVariantsMap).map(([fontName, variants]) => ({
    fontName,
    totalVariants: variants.totalVariants,
    weights: variants.weights,
    styles: variants.styles,
  }));
}

console.log('所有字体信息:', getAllFontsInfo());

export { findVariant, getAllFontsInfo };