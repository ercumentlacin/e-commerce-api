const path = require('path');
const nodeExternals = require('webpack-node-externals');
// const WebpackShellPlugin = require('webpack-shell-plugin');
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
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@models': path.resolve(__dirname, 'src/models'),
      '@controllers': path.resolve(__dirname, 'src/controllers'),
      '@middlewares': path.resolve(__dirname, 'src/middlewares'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@routes': path.resolve(__dirname, 'src/routes'),
    },
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
