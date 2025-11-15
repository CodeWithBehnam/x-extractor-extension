import { writeFileSync } from 'fs';
import { createCanvas } from 'canvas';

const sizes = [16, 48, 128];
const backgroundColor = '#1DA1F2'; // X.com blue
const textColor = '#FFFFFF';

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Draw "X" letter
  ctx.fillStyle = textColor;
  ctx.font = `bold ${Math.floor(size * 0.7)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('X', size / 2, size / 2);

  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  writeFileSync(`./public/icons/icon-${size}.png`, buffer);
  console.log(`Generated icon-${size}.png`);
});

console.log('All icons generated successfully!');
