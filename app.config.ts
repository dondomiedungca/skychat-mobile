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
      supportsTablet: true
    },
    android: {
      package: 'dev.dondomain.skychat',
      adaptiveIcon: {
        foregroundImage: './assets/png/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      googleServicesFile: './google-services.json'
    },
    web: {
      favicon: './assets/png/icon.png'
    },
    extra: {
      eas: {
        projectId: 'e5480611-21d5-4f59-bab4-35afe8a9e1d3'
      },
      ...(configurations && { ...configurations })
    },
    updates: {
      url: 'https://u.expo.dev/e5480611-21d5-4f59-bab4-35afe8a9e1d3'
    },
    runtimeVersion: {
      policy: 'sdkVersion'
    },
    owner: 'dondon181409',
    scheme: 'dev.dondomain.skychat',
    originalFullName: '@dondon181409/skychat',
    currentFullName: '@dondon181409/skychat',
    plugins: [
      [
        '@config-plugins/react-native-webrtc',
        {
          cameraPermission: 'Allow Skychat to access your camera',
          microphonePermission: 'Allow Skychat to access your microphone'
        }
      ],
      [
        'expo-notifications',
        {
          icon: './assets/png/notification-icon.png',
          color: '#ffffff'
        }
      ]
    ]
  }
};
