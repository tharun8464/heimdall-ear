const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js', // The entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // The output directory for bundled files
    filename: '[name].[contenthash].js', // Cache-busting for JS files
    publicPath: '/', // Set the base path for all assets
  },
  mode: 'production', // Set to production for optimizations
  plugins: [
    new CleanWebpackPlugin(), // Cleans the output directory before each build
    new CompressionPlugin(), // Compresses assets
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css', // Cache-busting for CSS files
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'), // Define production environment
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'], // Extract CSS to separate files
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'], // Extract SCSS to separate files
      },
      {
        test: /\.svg$/,
        use: ['file-loader'], // Use file-loader for SVGs with hashing for cache busting
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash].[ext]', // Cache-busting for images
            },
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'all',
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            // Rename variables and functions with meaningless names
            keep_fnames: false,
            keep_classnames: false,
          },
          compress: {
            drop_console: true, // Remove console statements for production
            drop_debugger: true,
          },
        },
      }),
    ],
  },
  devtool: 'source-map', // Use source-map for production for debugging
};