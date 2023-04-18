const configurations = require(`./src/configurations/config.${
  process.env.EXPO_RELEASE_CHANNEL || 'development'
}.json`);

module.exports = {
  expo: {
    name: 'Skychat',
    slug: 'skychat',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/png/icon.png',
    userInterfaceStyle: 'light',
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: 'com.mainrow.skychat',
      adaptiveIcon: {
        foregroundImage: './assets/png/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './assets/png/icon.png',
    },
    extra: {
      eas: {
        projectId: 'e5480611-21d5-4f59-bab4-35afe8a9e1d3',
      },
      ...(configurations && { ...configurations }),
    },
    owner: 'dondon181409',
    scheme: 'com.mainrow.skychat',
  },
};
