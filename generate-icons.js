import { writeFileSync } from 'fs';
import { createCanvas } from 'canvas';

const sizes = [16, 48, 128];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Create gradient background (X.com blue to purple)
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#1DA1F2'); // X.com blue
  gradient.addColorStop(1, '#5B51D8'); // Deep purple

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Add rounded corners for modern look
  ctx.globalCompositeOperation = 'destination-in';
  const radius = size * 0.2;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();

  ctx.globalCompositeOperation = 'source-over';

  // Scale factors for different icon sizes
  const scale = size / 128;
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = Math.max(2, 6 * scale);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw database/table icon (top part)
  const tableY = size * 0.25;
  const tableWidth = size * 0.5;
  const tableHeight = size * 0.15;
  const tableX = (size - tableWidth) / 2;

  // Table rows
  for (let i = 0; i < 3; i++) {
    const y = tableY + (i * tableHeight / 2);
    ctx.fillRect(tableX, y, tableWidth, tableHeight / 6);
  }

  // Draw download arrow (bottom part)
  const arrowCenterX = size / 2;
  const arrowStartY = size * 0.48;
  const arrowEndY = size * 0.75;
  const arrowWidth = size * 0.12;

  // Arrow shaft
  ctx.beginPath();
  ctx.moveTo(arrowCenterX, arrowStartY);
  ctx.lineTo(arrowCenterX, arrowEndY);
  ctx.stroke();

  // Arrow head
  ctx.beginPath();
  ctx.moveTo(arrowCenterX - arrowWidth, arrowEndY - arrowWidth);
  ctx.lineTo(arrowCenterX, arrowEndY);
  ctx.lineTo(arrowCenterX + arrowWidth, arrowEndY - arrowWidth);
  ctx.stroke();

  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  writeFileSync(`./public/icons/icon-${size}.png`, buffer);
  console.log(`Generated icon-${size}.png`);
});

console.log('All icons generated successfully!');
