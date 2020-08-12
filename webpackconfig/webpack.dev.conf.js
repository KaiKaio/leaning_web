const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path"); // resolve用来拼接绝对路径的方法

module.exports = {
  entry: {
    index: resolve(__dirname, "src", "index.js"),
  },
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 11 * 1024, // 图片小于8KB，则被 Base64 处理
          // 问题：因为 Url-Loader 默认使用Es6模块化解析，而 Html-Loader 引入图片是 Commonjs
          // 解析时会出问题：[object Module]
          // 解决：关闭url-loader的es6模块化，使用 Commonjs 解析
          esModule: false,
          // 重命名 - 图片
          // [hash:10] 取图片的hash的前10位
          // [ext] 取文件原来扩展名
          name: '[hash:10].[ext]',
          outputPath: 'imgs'
        }
      },
      {
        test: /\.html$/,
        // 处理 Html文件的 Img标签（负责引入图片，从而能被 Url_Loader进行处理）
        loader: 'html-loader'
      },
      {
        // 打包其他资源(除了 Html / Js / Css以外的资源)
        exclude: /\.(js|html|scss|css|jpg|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'media'
        }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（JS/CSS）
      template: resolve(__dirname, "src", "index.html"),
    }),
  ],
  mode: 'development',
  // mode: 'production,'
  
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'build'),
    compress: true,
    port: 3000
  }
};
