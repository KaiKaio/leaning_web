const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const { resolve } = require("path"); // resolve用来拼接绝对路径的方法

// 设置nodejs环境变量
// process.env.NODE_ENV = 'development';

module.exports = {
  entry: {
    index: resolve(__dirname, "src", "index.js"),
  },
  output: {
    filename: "js/built.js",
    path: resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader:MiniCssExtractPlugin.loader,
            options: {
                publicPath: '../'
            }
          },
          "css-loader",
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                // postcss的插件
                require('postcss-preset-env')()
              ]
            }
          },
          "sass-loader"
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader:MiniCssExtractPlugin.loader,
            options: {
                publicPath: '../'
            }
          },
          "css-loader",
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                // postcss的插件
                require('postcss-preset-env')()
              ]
            }
          }
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                // 按需加载
                useBuiltIns: 'usage',
                corejs: {
                  version: 3
                },
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17'
                }
              }
            ]
          ]
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // 自动修复eslint的错误
          fix: true,
          globals: [
            "document"
          ]
        }
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: "url-loader",
        options: {
          limit: 11 * 1024, // 图片小于8KB，则被 Base64 处理
          // 问题：因为 Url-Loader 默认使用Es6模块化解析，而 Html-Loader 引入图片是 Commonjs
          // 解析时会出问题：[object Module]
          // 解决：关闭url-loader的es6模块化，使用 Commonjs 解析
          esModule: false,
          // 重命名 - 图片
          // [hash:10] 取图片的hash的前10位
          // [ext] 取文件原来扩展名
          name: "[hash:10].[ext]",
          outputPath: "imgs",
        },
      },
      {
        test: /\.html$/,
        // 处理 Html文件的 Img标签（负责引入图片，从而能被 Url_Loader进行处理）
        loader: "html-loader",
      },
      {
        // 打包其他资源(除了 Html / Js / Css以外的资源)
        exclude: /\.(js|html|scss|css|jpg|png|gif)$/,
        loader: "file-loader",
        options: {
          name: "[hash:10].[ext]",
          outputPath: "media",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（JS/CSS）
      template: resolve(__dirname, "src", "index.html"),
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      // 对输出的Css文件进行重命名
      filename: "css/built.css",
    }),
    new OptimizeCssAssetsWebpackPlugin()
  ],
  mode: 'production',
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, "build"),
    compress: true,
    port: 3000,
  },
};
