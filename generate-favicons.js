import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

async function generateFavicons() {
  const inputPath = join(__dirname, 'public', 'main-logo.png');

  console.log('Generating favicons from main-logo.png...\n');

  for (const { size, name } of sizes) {
    try {
      await sharp(inputPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(join(__dirname, 'public', name));

      console.log(`✓ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`✗ Error generating ${name}:`, error.message);
    }
  }

  // Generate a square logo for OG images (512x512 with padding)
  try {
    await sharp(inputPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(join(__dirname, 'public', 'logo-512x512.png'));

    console.log('✓ Generated logo-512x512.png for OG images');
  } catch (error) {
    console.error('✗ Error generating logo-512x512.png:', error.message);
  }

  console.log('\n✓ All favicons generated successfully!');
}

generateFavicons().catch(console.error);
