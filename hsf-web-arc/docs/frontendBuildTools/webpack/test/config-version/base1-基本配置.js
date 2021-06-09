const path = require('path');
// html的模板插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 该插件是将css通过link链接的形式进行引用（css的抽取）
// style-loader 是将css样式插到style标签中去
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 该插件是将css放在标签中去（内联的形式）
// const HtmlInlineCssWebpackPlugin= require('html-inline-css-webpack-plugin').default;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// webpack自己实现了一个模块导入方式，需要使用commonJS的规范，
module.exports = {
  context: process.cwd(),
  // 入口
  entry: {
    index:'./src/index.js',
    common: './src/common.js'
  },
  // 输出
  output: {
    path: path.resolve(__dirname, 'dist'),
    // [name] 这样写是name是根据入口的文件的key值来，作为输出的文件名
    filename: '[name].js',
    publicPath:'/'
  },
  // 模型
  // 承载loader的地方，也是loader配置的地方
  module: {
    rules: [
      // loader 的执行顺序 从右往左
      // 从下往上 
      // 可写成 数组 对象 字符串的格式
      // loader的分类 三类 前置loader(pre) 后置loader(post)  普通loader(normal)
      // 处理css文件
      {
        // 匹配处理文件的扩展名的正则表达式
        test: /\.css/,
        // 指定那些css文件需要转化
        include: path.resolve(__dirname, 'src'),
        // 排除不需要转化的css文件
        exclude: /node_modules/,
        // use使用loader，每个loader可以是一个对象，配置需要的参数
        use:[{
          // 要抽取css文件，包含在MiniCssExtractPlugin插件中去
          loader: MiniCssExtractPlugin.loader,
          options: {
            // 指定的是构建后在html里的路径
            publicPath:'/dist/css/'
          }
          // // 指定的loader
          // loader: 'style-loader',
          // // loader配置项
          // options: {
          //   // insert:'top'
          // }
        }, 'css-loader']
        // loader: ['style-loader', 'css-loader']
      },
      // {
      //   test:/\.(eot|svg|woff2|woff|ttf)/,
      //   use:'file-loader'
      // },
      // 处理图片文件
      {
        test: /\.(jpg|jpeg|png|bmp|gif|svg|ttf|woff|woff2|eot)/,
        use:[
          {
            loader: 'url-loader',
            options:{
              // 如果图片小于4096会转化为base64，
              // 超出限制会打包出文件
              limit: 4096,
              // 输出路径
              outputPath: 'images',
              // 指定的是构建后在html里的路径
              publicPath: '/dist/images'
            }
          }
        ]
      }
    ]
  },
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
                  template:'./src/index.html',//指定模板文件
                  filename:'index.html',//产出后的文件名
                  inject:false,
                  hash:true,//为了避免缓存，可以在产出的资源后面添加hash值
                  // 打包之后产生的片段，和入口保持一致
                  chunks:['common','index'],
                  chunksSortMode:'manual'//对引入代码块进行排序的模式
              }),
    new MiniCssExtractPlugin({
      // 抽取出css，打包成一个单独的css文件
      // 此插件需要修改css的rules
      // 入口的css文件
      filename: 'css/[name].css',
      // 打包之后css出口文件
      chunkFilename: 'css/[id].css'
    }),
    // 注意此插件要放在HtmlWebpackPlugin的下面，HtmlWebpackPlugin的inject设置为true
    // new HtmlInlineCssWebpackPlugin()
  ],
  // 本地服务
  devServer: {
    // 启动的是一个静态的目录
    // 对于webpack启动服务之后是利用webpack-dev-server启动服务之后，把打包好的文件放到内存中去，
    // 在内存中的目录是以根为目录的
    contentBase: path.resolve(__dirname, 'dist'),
    host: 'localhost',
    // 是否开启gzip的压缩
    compress: true,
    port: 8082
  },
  // 模式
  mode: 'development',
  // 压缩文件的配置项
  optimization: {
    minimizer: [
       new UglifyJsPlugin({
            cache: true,//启动缓存
            parallel: true,//启动并行压缩
            //如果为true的话，可以获得sourcemap
            sourceMap: true // set to true if you want JS source maps
        }),
        // new TerserPlugin({
        //      parallel: true,
        //      cache: true
        // }),
        //压缩css资源的
        new OptimizeCSSAssetsPlugin({
             assetNameRegExp:/\.css$/g,
             //cssnano是PostCSS的CSS优化和分解插件。cssnano采用格式很好的CSS，
            //  并通过许多优化，以确保最终的生产环境尽可能小。
             cssProcessor:require('cssnano')
        })
    ]
},
}

/**
 * 本段是webpack的基本配置，
 *    1、entry入口文件的配置（可以多文件、单文件）这个是webpack打包的构建树结构的依赖文件，具体的详细配置看官方文档
 *    2、output 当webpack将整个项目都构建好了之后，文件的输出目录
 *    3、module 模块这个主要是webpack使用各种loader转化各种文件，例如css、字体、图片
 *    4、plugins 这个是webpack本身的一种扩展，用于处理构建时一些其他的操作
 *    5、mode 是webpack指定的打包模式
 *    6、optimization 是压缩优化方面的配置
 * 
 * 用到的一些包：
 *    style-loader 是将样式插入到style标签中去 css-loader 将css文件进行转化为js
 *    url-loader 将图片在指定的范围内转化成base64，主要是对图片进行转化的loader  file-loader 对于一些字体文件进行处理，拷贝，生成内部路径
 *    html-webpack-plugin 模板的拷贝
 *    mini-css-extract-plugin css的抽取  html-inline-css-webpack-plugin
 *    uglifyjs-webpack-plugin js代码的压缩
 *    terser-webpack-plugin js代码的转化
 *    optimize-css-assets-webpack-plugin css文件的压缩
 * */ 