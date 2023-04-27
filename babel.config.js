module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'EXPO_RELEASE_CHANNEL',
          moduleName: '@env',
          path: './src/environments/.env',
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
