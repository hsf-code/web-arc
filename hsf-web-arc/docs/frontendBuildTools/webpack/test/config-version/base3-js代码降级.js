const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
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
        test: /\.jsx?$/,
        use: {
            loader: 'babel-loader',
            options:{
             "presets": ["@babel/preset-env"],
             "plugins": [
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ["@babel/plugin-proposal-class-properties", { "loose" : true }]
             ]
            }
        },
        include: path.join(__dirname,'src'),
        exclude:/node_modules/
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
              })
  ],
  // 本地服务
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: 'localhost',
    compress: true,
    port: 8082
  },
  // 模式
  mode: 'development',
}

/**
 * 配置babel对js代码降级的时候需要作如下操作：
 *    1、jsconfig.json 文件是允许一些js的实验性语言的书写与编译
 *    2、babel整体的配置是在.babelrc文件中指定那些需要编译
 *    3、配置webpack.config.js文件
 *    4、一些babel的包
 *        1、 babel的核心包
 *           babel-loader 
 *           @babel/core 
 *           @babel/preset-env  
 *           @babel/preset-react
 *         
 *        2、babel的插件
 *           @babel/plugin-proposal-decorators 
 *           @babel/plugin-proposal-class-properties
 *        3、babel运行时的一些优化插件
 *          @babel/plugin-transform-runtime 开发环境下的优化插件
 *          @babel/runtime 生产环境下 
 * */ 