
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const generateSourceMap = env.sourcemap || !isProduction;

  const config = {
    entry: {
      popup: './src/popup.tsx',
      background: './src/background.ts',
      content: './src/content.ts'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        chunks: ['popup']
      }),
      new CopyPlugin({
        patterns: [
          {
            from: "public",
            to: ".",
            globOptions: {
              ignore: ["**/index.html"]
            }
          },
          {
            from: "manifest.json",
            to: "."
          }
        ]
      })
    ],
    devtool: generateSourceMap ? (isProduction ? 'source-map' : 'inline-source-map') : false,
    mode: isProduction ? 'production' : 'development'
  };

  // Add development server configuration if not in production
  if (!isProduction) {
    config.devServer = {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
      hot: true,
      devMiddleware: {
        writeToDisk: true, // Write files to disk in dev mode for Chrome extension loading
      }
    };
  }

  return config;
};
