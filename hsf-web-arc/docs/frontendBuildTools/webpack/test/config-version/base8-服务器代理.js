let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin')
let { CleanWebpackPlugin } = require('clean-webpack-plugin');
let webpack = require('webpack');
let CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = { // node commonjs规范
    entry: {
        index:'./src/index.js',
        // common: './src/common.js'
    }, // 当前入口文件的位置  
    output:{
        filename:'[name].[hash:8].js',
        path:path.resolve(__dirname,'dist')
    },
    module:{
        rules:[
        ]
    },
    plugins:[
      // 清除dist文件夹下的文件
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            minify:{
                removeAttributeQuotes:true,
                collapseWhitespace:true
            },
            inject: true,
            hash:true,
            filename:'login.html'
        }),
        // 添加商标
        new webpack.BannerPlugin('hsf测试'),
        new CopyWebpackPlugin(
            {
                patterns: [
                  { 
                    //静态资源目录源地址
                    from: path.resolve(__dirname,'src/static'), 
                    // 目标地址，相对于output的path目录
                    to: path.resolve(__dirname,'dist/static') },
                ],
              })
    ],
    devServer: {
        // 开发的时候接口的代理
        // 这一张有很多需要看一下
        proxy: {
            // 代理的接口
          '/api': {
            // 可以修改域名（解决跨域的问题）
            target: 'http://localhost:3000',
            // 将/api 替换成/
            pathRewrite: { '^/api': '/' },
          },
        },
        // 做一些请求的拦截器，可以做mock数据
        before: function (app, server, compiler) {
            app.get('/some/path', function (req, res) {
              res.json({ custom: 'response' });
        });
    },
    // //默认false,也就是不开启
    // watch:true,
    // //只有开启监听模式时，watchOptions才有意义
    // watchOptions:{
    //   //默认为空，不监听的文件或者文件夹，支持正则匹配
    //   ignored:/node_modules/,
    //   //监听到变化发生后会等300ms再去执行，默认300ms
    //   aggregateTimeout:300,
    //   //判断文件是否发生变化是通过不停的询问文件系统指定议是有变化实现的，默认每秒问1000次
    //   poll:1000
    // }
}