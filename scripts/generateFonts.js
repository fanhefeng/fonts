#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 字体格式优先级（优先选择更优化的格式）
const FONT_FORMAT_PRIORITY = {
  '.woff2': 4,
  '.woff': 3,
  '.ttf': 2,
  '.otf': 2,
  '.eot': 1
};

// Weight映射表
const WEIGHT_MAP = {
  'thin': '100',
  'extralight': '200',
  'ultralight': '200',
  'light': '300',
  'regular': '400',
  'normal': '400',
  'medium': '500',
  'semibold': '600',
  'bold': '700',
  'extrabold': '800',
  'ultrabold': '800',
  'black': '900',
  'heavy': '900'
};

// Style映射表
const STYLE_MAP = {
  'italic': 'italic',
  'oblique': 'oblique'
};

// 解析字体文件名获取weight和style
function parseFontFile(filename) {
  const name = filename.toLowerCase().replace(/\.(ttf|otf|woff2?|eot)$/, '');
  
  let weight = '400';
  let style = 'normal';
  
  // 检查是否包含italic
  if (name.includes('italic') || name.includes('oblique')) {
    style = name.includes('oblique') ? 'oblique' : 'italic';
  }
  
  // 检查weight关键词（按特殊性排序，避免误匹配）
  const weightPatterns = [
    { pattern: /ultralight|extralight/, weight: '200' },
    { pattern: /black/, weight: '900' },
    { pattern: /extrabold|ultrabold/, weight: '800' },
    { pattern: /semibold/, weight: '600' },
    { pattern: /bold/, weight: '700' },
    { pattern: /medium/, weight: '500' },
    { pattern: /light/, weight: '300' },
    { pattern: /thin/, weight: '100' },
    { pattern: /regular|normal/, weight: '400' }
  ];
  
  for (const { pattern, weight: w } of weightPatterns) {
    if (pattern.test(name)) {
      weight = w;
      break;
    }
  }
  
  // 处理数字weight（例如：Font-300.ttf）
  const numericWeightMatch = name.match(/(\d{3})/);
  if (numericWeightMatch) {
    const numWeight = numericWeightMatch[1];
    if (['100', '200', '300', '400', '500', '600', '700', '800', '900'].includes(numWeight)) {
      weight = numWeight;
    }
  }
  
  return { weight, style };
}

// 扫描字体目录
function scanFontsDirectory(fontsDir) {
  const fontFamilies = {};
  
  function scanDirectory(dir, relativePath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const currentRelativePath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath, currentRelativePath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (FONT_FORMAT_PRIORITY[ext]) {
          const dirName = path.basename(path.dirname(fullPath));
          const parentDir = path.basename(path.dirname(path.dirname(fullPath)));
          
          // 确定字体家族名称
          let familyName = dirName;
          if (parentDir !== 'fonts') {
            familyName = parentDir;
          }
          
          const { weight, style } = parseFontFile(entry.name);
          
          if (!fontFamilies[familyName]) {
            fontFamilies[familyName] = {
              name: familyName,
              variants: []
            };
          }
          
          // 检查是否已存在相同的weight+style组合，选择优先级更高的格式
          const existingVariant = fontFamilies[familyName].variants.find(
            v => v.weight === weight && v.style === style
          );
          
          if (!existingVariant) {
            fontFamilies[familyName].variants.push({
              path: currentRelativePath.replace(/\\/g, '/'),
              weight,
              style,
              format: ext
            });
          } else {
            // 如果新格式优先级更高，替换现有的
            if (FONT_FORMAT_PRIORITY[ext] > FONT_FORMAT_PRIORITY[existingVariant.format]) {
              existingVariant.path = currentRelativePath.replace(/\\/g, '/');
              existingVariant.format = ext;
            }
          }
        }
      }
    }
  }
  
  scanDirectory(fontsDir);
  return fontFamilies;
}

// 生成字体配置代码
function generateFontConfig(fontFamilies) {
  let imports = 'import localFont from "next/font/local";\n\n';
  let exports = '';
  let fontArray = [];
  
  Object.values(fontFamilies).forEach(family => {
    const exportName = family.name
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^./, str => str.toUpperCase());
    
    fontArray.push(exportName);
    
    exports += `export const ${exportName} = localFont({\n`;
    
    if (family.variants.length === 1) {
      // 单一变体
      const variant = family.variants[0];
      exports += `\tsrc: "./fonts/${variant.path}",\n`;
    } else {
      // 多变体
      exports += `\tsrc: [\n`;
      family.variants
        .sort((a, b) => {
          // 按weight排序，再按style排序
          if (a.weight !== b.weight) {
            return parseInt(a.weight) - parseInt(b.weight);
          }
          return a.style === 'normal' ? -1 : 1;
        })
        .forEach(variant => {
          exports += `\t\t{\n`;
          exports += `\t\t\tpath: "./fonts/${variant.path}",\n`;
          exports += `\t\t\tweight: "${variant.weight}",\n`;
          exports += `\t\t\tstyle: "${variant.style}",\n`;
          exports += `\t\t},\n`;
        });
      exports += `\t],\n`;
    }
    
    const variableName = family.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    exports += `\tvariable: "--font-${variableName}",\n`;
    exports += `\tdisplay: "swap",\n`;
    exports += `});\n\n`;
  });
  
  // 生成myFonts数组
  exports += `export const myFonts = [${fontArray.join(', ')}];\n`;
  
  return imports + exports;
}

// 主函数
function main() {
  const fontsDir = path.join(__dirname, '../styles/fonts');
  const outputPath = path.join(__dirname, '../styles/fonts.ts');
  
  console.log('🔍 扫描字体目录:', fontsDir);
  
  if (!fs.existsSync(fontsDir)) {
    console.error('❌ 字体目录不存在:', fontsDir);
    process.exit(1);
  }
  
  const fontFamilies = scanFontsDirectory(fontsDir);
  
  console.log(`📚 发现 ${Object.keys(fontFamilies).length} 个字体家族:`);
  Object.values(fontFamilies).forEach(family => {
    console.log(`  • ${family.name} (${family.variants.length} 个变体)`);
    family.variants.forEach(variant => {
      console.log(`    - Weight: ${variant.weight}, Style: ${variant.style}, Format: ${variant.format}`);
    });
  });
  
  const config = generateFontConfig(fontFamilies);
  
  // 备份原有文件
  if (fs.existsSync(outputPath)) {
    const backupPath = outputPath + '.backup.' + Date.now();
    fs.copyFileSync(outputPath, backupPath);
    console.log('💾 已备份原文件到:', backupPath);
  }
  
  fs.writeFileSync(outputPath, config, 'utf8');
  console.log('✅ 已生成新的字体配置文件:', outputPath);
  console.log('');
  console.log('🎉 字体配置生成完成！请检查生成的文件并重启开发服务器。');
}

if (require.main === module) {
  main();
}

module.exports = { scanFontsDirectory, generateFontConfig, parseFontFile };