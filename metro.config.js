// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable extra caching safeguards to prevent update loops
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
    assetExts: ['ttf', 'png', 'jpg'],
  },
  transformer: {
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
  },
});

module.exports = config;