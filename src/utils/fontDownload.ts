import { NextFontWithVariableWithLiked } from '@/types/global';

// Font file extensions mapping
const FONT_EXTENSIONS: { [key: string]: string[] } = {
  'Christmas': ['ttf'],
  'Iconmoon': ['woff'],
  'Music': ['otf'],
  'PingFangSC': ['woff2', 'ttf'],
  'PingFangTC': ['ttf'],
  'Poppins': ['ttf'],
  'Pragmata': ['ttf'],
  'RobotoMono': ['ttf']
};

// Extract font name from className
export const getFontName = (className: string): string => {
  // Remove the font prefix and convert to readable name
  return className.replace('font-', '').replace(/([A-Z])/g, ' $1').trim();
};

// Get available font files for a font
export const getFontFiles = (font: NextFontWithVariableWithLiked) => {
  const fontFamilyName = font.style.fontFamily.split(',')[0].slice(1, -1);
  
  // Try to match the font name with our extensions mapping
  const matchingKey = Object.keys(FONT_EXTENSIONS).find(key => 
    fontFamilyName.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(fontFamilyName.toLowerCase())
  );

  if (matchingKey) {
    return FONT_EXTENSIONS[matchingKey];
  }
  
  // Default fallback
  return ['ttf'];
};

// Download a font file
export const downloadFontFile = async (font: NextFontWithVariableWithLiked, extension: string = 'ttf', targetWeight: number = 400): Promise<boolean> => {
  try {
    const fontFamilyName = font.style.fontFamily.split(',')[0].slice(1, -1);
    let fontPath = '';
    
    // Check if the font has source information from the font definition
    if ('src' in font) {
      const src = font.src as string | { path: string; weight?: string; style?: string }[];
      if (typeof src === 'string') {
        fontPath = src;
      } else if (Array.isArray(src) && src.length > 0) {
        // Try to find the file that matches the target weight
        const matchingWeight = src.find((s: { path?: string; weight?: string }) => 
          s.weight && parseInt(s.weight) === targetWeight
        );
        
        if (matchingWeight?.path) {
          fontPath = matchingWeight.path;
        } else {
          // If no exact weight match, find closest weight or preferred format
          const preferredFormat = src.find((s: { path?: string }) => s.path?.endsWith(`.${extension}`));
          fontPath = preferredFormat?.path || src[0].path;
        }
      }
    }

    // If we couldn't find path from src, use direct mapping with weight consideration
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
      
      const pathMapping: { [key: string]: string } = {
        'Christmas': '/fonts/Christmas/YiQiShengDanTi.ttf',
        'Iconmoon': '/fonts/Iconmoon/icomoon.woff', 
        'Music': '/fonts/Music/ZhuLangYinYueFuHaoGePuTi.otf',
        'PingFang SC': `/fonts/PingFangSC/PingFangSC-${weightName}.woff2`,
        'PingFang TC': `/fonts/PingFangTC/PingFangTC-${weightName}.ttf`,
        'Poppins': `/fonts/Poppins/Poppins-${weightName}.ttf`,
        'Pragmata': '/fonts/Pragmata/Pragmata.ttf',
        'Roboto Mono': `/fonts/RobotoMono/RobotoMono-${weightName}.ttf`
      };

      fontPath = pathMapping[fontFamilyName] || `/fonts/${fontFamilyName}/${fontFamilyName}-${weightName}.${extension}`;
    } else {
      // Convert relative path to public URL path
      if (fontPath.startsWith('./fonts/')) {
        fontPath = '/fonts' + fontPath.substring(8); // Remove ./fonts and add /fonts
      } else if (fontPath.startsWith('./')) {
        fontPath = '/fonts' + fontPath.substring(1);
      }
    }

    console.log('Downloading font from:', fontPath, 'for weight:', targetWeight); // Debug log
    
    // Fetch the font file
    const response = await fetch(fontPath);
    if (!response.ok) {
      // If specific weight file not found, try to fall back to regular weight
      if (targetWeight !== 400) {
        console.log('Specific weight not found, trying regular weight...');
        return await downloadFontFile(font, extension, 400);
      }
      throw new Error(`Failed to fetch font file: ${response.statusText}`);
    }

    // Get the file blob
    const blob = await response.blob();
    
    // Create download filename
    const fileName = fontPath.split('/').pop() || `${fontFamilyName}.${extension}`;
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (downloadError) {
    console.error('Font download failed:', downloadError);
    throw new Error(`Failed to download font: ${downloadError instanceof Error ? downloadError.message : 'Unknown error'}`);
  }
};

// Download all variants of a font family
export const downloadFontFamily = async (font: NextFontWithVariableWithLiked) => {
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
};