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
    },
    //配置加载规则
      {
          test: /\.js$/,
          loader: 'eslint-loader',
          // 在所有js文件处理的loader前面加载去校验代码规范
          enforce: "pre",
          include: [path.resolve(__dirname, 'src')], // 指定检查的目录
          options: { fix: true } // 这里的配置项参数将会被传递到 eslint 的 CLIEngine   
      },]
  },
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
                  template:'./src/index.html',//指定模板文件
                  filename:'index.html',//产出后的文件名
                  // true || 'head' || 'body' || false将所有资产注入给定的templateor templateContent
                  inject: true,
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
 * eslint eslint-loader babel-eslint
 * 
 * */ 