const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

let config = {
  entry: './src/index.js'
};

module.exports = (env, argv) => {
  const production = argv.mode === 'production';

  if(!production) {
    config.devtool = 'source-map'
  }
  
  config.module = {
    rules: [
      {
        test: /\.(twig)$/,
        use: [{
          loader: 'html-loader',
          options: {
            attributes: {
              list: [
                {
                  tag: 'img',
                  attribute: 'src',
                  type: 'src',
                },
                {
                  tag: 'img',
                  attribute: 'data-src',
                  type: 'src',
                },
                {
                  tag: 'img',
                  attribute: 'data-srcset',
                  type: 'srcset',
                },
                {
                  tag: 'a',
                  attribute: 'href',
                  type: 'src',
                  filter: (tag, attribute, attributes) => {  
                    if (
                      attributes.href &&
                      !attributes.href.trim().toLowerCase().includes('.pdf')
                    ) {
                      return false;
                    }
  
                    return true;
                  }
                }
              ]
            }
          }
        }]
      },
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: !production,
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                sourceMap: !production,
                fiber: require('fibers'),
                includePaths: ['scss'],
                outputStyle:  production ? 'compressed' : 'expanded',
              }
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|ico|pdf)$/,
        include: path.resolve(__dirname, 'images'),
        loader: 'file-loader',
        options: {
          outputPath: 'images',
        }
      },

    ],
  };
  config.plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        template: 'template/template.html',
        filename: 'index.html',
        inject: 'body'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  config.output = {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  };
  return config;
};