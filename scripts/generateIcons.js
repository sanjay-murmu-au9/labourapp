const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Icon sizes needed for different platforms
const ICON_SIZES = [
    1024, // App Store
    512,  // Play Store
    192,  // Android
    180,  // iOS
    120,  // iOS
    96,   // Android
    72,   // Android
    48,   // Android
];

function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#128C7E';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Scale everything based on size
    const scale = size / 1024;
    ctx.scale(scale, scale);

    // Person shape
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(512, 350, 150, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.moveTo(312, 600);
    ctx.bezierCurveTo(312, 500, 712, 500, 712, 600);
    ctx.lineTo(712, 800);
    ctx.lineTo(312, 800);
    ctx.closePath();
    ctx.fill();

    // Tools
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#FFFFFF';
    ctx.fillStyle = '#FFFFFF';

    // Left tool
    ctx.beginPath();
    ctx.moveTo(400, 350);
    ctx.lineTo(350, 250);
    ctx.lineTo(450, 300);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right tool
    ctx.beginPath();
    ctx.moveTo(624, 350);
    ctx.lineTo(674, 250);
    ctx.lineTo(574, 300);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    return canvas;
}

// Ensure the assets directory exists
const assetsDir = path.join(__dirname, '../assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

// Generate icons for all sizes
ICON_SIZES.forEach(size => {
    const canvas = drawIcon(size);
    const buffer = canvas.toBuffer('image/png');

    if (size === 1024) {
        fs.writeFileSync(path.join(assetsDir, 'icon.png'), buffer);
    }
    if (size === 512) {
        fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), buffer);
    }
});

console.log('Icons generated successfully!');