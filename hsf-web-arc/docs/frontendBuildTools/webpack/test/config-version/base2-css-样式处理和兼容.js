const path = require('path');
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
    filename: '[name].js',
    publicPath:'/'
  },
  // 模型
  // 承载loader的地方，也是loader配置的地方
  module: {
    rules: [
      {
        test:/\.css$/,
        // 数组形式的使用loader
        use:['style-loader','css-loader','postcss-loader'],
        include:path.join(__dirname,'./src'),
        exclude:/node_modules/
     },
      {
        test: /\.less/,
        include: path.resolve(__dirname,'src'),
        exclude: /node_modules/,
        // 对象形式的使用loader，可以为loader添加一些配置
        use: [{
            loader: 'style-loader',
        },'css-loader','less-loader']
    },
    {
        test: /\.scss/,
        include: path.resolve(__dirname,'src'),
        exclude: /node_modules/,
        use: [{
            loader: 'style-loader',
        },'css-loader','sass-loader']
    },
    ]
  },
}
/**
 * 对于less和scss文件的处理
 *    1、less less-loader 配置同上
 *    2、node-sass sass-loader
 * 3、对于css比较新的css属性的兼容，加上浏览器的前缀
 *    postcss-loader是处理css解析成js可以处理的抽象语法树会加载postcss.config.js文件  autoprefixer是给样式添加前缀的，需要配合postcss.config.js使用
 * */ 