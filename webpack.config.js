const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'src/[name].[fullhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true
            },
          }
        ]
      },
      {
        test: /\.(sa|sc)ss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      }
    ],
  },
  devServer: {
    historyApiFallback: true,
    host: '127.0.0.1',
    port: 9090,
    open: true,
    hot: true,
    client: {
      logging: 'info',
      overlay: true,
      progress: true,
      webSocketTransport: 'ws'
    },
    webSocketServer: 'ws'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      inject: 'body',
      hash: true
    }),
    new ESLintPlugin({
      extensions: 'js',
      exclude: 'node_modules',
      files: './src/'
    })
  ]
};
