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
    mode:'development',
    plugins:[
      // 清除dist文件夹下的文件
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            // html的压缩
            minify:{
              // 删除双引号
                removeAttributeQuotes:true,
                // 折叠起空行
                collapseWhitespace:true
            },
            inject: true,
            // 对引入的js文件，加上hash值
            hash:true,
            // 输出html的文件名
            filename:'login.html'
        }),
    ],
}