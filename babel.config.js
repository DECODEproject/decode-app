module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    'module:react-native-dotenv',
  ],
  plugins: [
    'babel-plugin-styled-components',
    '@babel/plugin-proposal-export-namespace-from',
    [
      'module-resolver',
      {
        root: './src',
      },
    ],
  ],
};
