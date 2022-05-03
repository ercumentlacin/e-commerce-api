const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  watch: NODE_ENV === 'development',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
        logLevel: 'info',
        extensions: ['.ts', '.tsx'],
        mainFields: ['browser', 'main'],
      }),
    ],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{ loader: 'ts-loader' }],
        exclude: [/node_modules/, /__tests__/],
      },
    ],
  },

  externals: [nodeExternals()],

  plugins: [
    new WebpackShellPluginNext({
      onBuildStart: {
        scripts: ['echo "===> Starting packing with WEBPACK 5"'],
        blocking: true,
        parallel: false,
      },
      onBuildEnd: {
        scripts: ['yarn run:dev'],
        blocking: false,
        parallel: true,
      },
    }),
  ],
};
