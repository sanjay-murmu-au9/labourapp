// Simple metro config
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add additional file types
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'cjs',
];

// Add additional asset types
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'db',
];

module.exports = config;