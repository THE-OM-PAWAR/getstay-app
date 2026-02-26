# GetStay Favicon & App Icons

This directory contains all favicon and app icon assets for the GetStay platform.

## Brand Colors
- Primary: `#3932d8` (Brand Blue)
- Light: `#b7b4f0` (Light Purple/Blue)
- Background: `#fffffd` (Off-white)
- Dark: `#010105` (Near Black)

## Files Overview

### Core Favicons
- `favicon.ico` - 48x48 multi-resolution ICO file for browsers
- `favicon-16x16.png` - 16x16 PNG for browser tabs
- `favicon-32x32.png` - 32x32 PNG for browser bookmarks

### Apple/iOS Icons
- `apple-touch-icon.png` - 180x180 PNG for iOS home screen
- `safari-pinned-tab.svg` - SVG for Safari pinned tabs (monochrome)

### Android/Chrome Icons
- `android-chrome-192x192.png` - 192x192 PNG for Android home screen
- `android-chrome-512x512.png` - 512x512 PNG for splash screens

### Microsoft/Windows Icons
- `mstile-150x150.png` - 150x150 PNG for Windows tiles
- `browserconfig.xml` - Configuration for Windows tiles

### Web App Manifest
- `site.webmanifest` - PWA manifest with app metadata

## Design Guidelines

### Icon Design
The GetStay icon should feature:
- Clean, minimal design
- "GS" monogram or hostel/building symbol
- Brand primary color (#3932d8) as main color
- Light accent color (#b7b4f0) for highlights
- High contrast for visibility at small sizes

### Recommended Tools
- **Favicon Generator**: https://realfavicongenerator.net/
- **SVG Editor**: Figma, Adobe Illustrator, or Inkscape
- **PNG Optimization**: TinyPNG or ImageOptim

## Generating New Icons

If you need to regenerate icons from a source design:

1. Create a square SVG or PNG (minimum 512x512px)
2. Use a favicon generator tool
3. Replace files in this directory
4. Update `site.webmanifest` if needed
5. Clear browser cache to see changes

## Browser Support

These assets provide comprehensive support for:
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ iOS Home Screen
- ✅ Android Home Screen
- ✅ Windows Tiles
- ✅ PWA Installation

## Testing

Test your favicons across devices:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Android)
- PWA installation on mobile
- Bookmarks and tabs
- Dark mode compatibility

## Notes

- All PNG files should be optimized for web
- SVG files should be minified
- ICO file should contain multiple resolutions
- Manifest theme colors match brand palette
- Icons support both light and dark modes
