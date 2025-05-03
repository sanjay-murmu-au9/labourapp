const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

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

async function convertSvgToPng(svgPath, size) {
    const svgBuffer = fs.readFileSync(svgPath);
    const pngBuffer = await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toBuffer();
    return pngBuffer;
}

async function generateIcons() {
    // Ensure the assets directory exists
    const assetsDir = path.join(__dirname, '../assets');
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir);
    }

    // Convert adaptive icon
    const adaptiveIconPath = path.join(assetsDir, 'adaptive-icon.svg');
    const adaptiveIconPng = await convertSvgToPng(adaptiveIconPath, 512);
    fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptiveIconPng);

    // Also use it for the main icon
    fs.writeFileSync(path.join(assetsDir, 'icon.png'), adaptiveIconPng);

    // Convert splash icon
    const splashIconPath = path.join(assetsDir, 'splash-icon.svg');
    const splashIconPng = await convertSvgToPng(splashIconPath, 1024);
    fs.writeFileSync(path.join(assetsDir, 'splash-icon.png'), splashIconPng);

    console.log('Icons generated successfully from SVG files!');
}

generateIcons().catch(console.error);