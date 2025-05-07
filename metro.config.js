const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

// Add this line to fix symbolication issues
process.env.METRO_SYMBOLICATE_TIMEOUT = 0;

module.exports = {
  ...defaultConfig,
  transformer: {
    ...defaultConfig.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    // Use Babel instead of Hermes for source transforms
    hermesParser: false,
    minifierPath: 'metro-minify-terser',
  },
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs'],
    // Ensure .js files are processed correctly
    resolverMainFields: ['react-native', 'browser', 'main'],
  },
  server: {
    // Increase timeout for slow operations
    timeout: 120000,
  },
  // Disable symbolication in development to avoid these errors
  symbolicate: {
    customizeFrame: () => null,
  },
};