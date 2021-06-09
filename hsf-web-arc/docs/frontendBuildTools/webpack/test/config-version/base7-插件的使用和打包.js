let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin')
let { CleanWebpackPlugin } = require('clean-webpack-plugin');
let webpack = require('webpack')
/**
 * 第三种插件变量的方式（在入口文件中引入）
 * require("expose-loader?$!jquery");
 * */ 
module.exports = { // node commonjs规范
    entry: {
        index:'./src/index.js',
        common: './src/common.js'
    }, // 当前入口文件的位置  
    output:{
        filename:'[name].[hash:8].js',
        path:path.resolve(__dirname,'dist')
    },
    module:{
        rules:[
            // 插件暴露的第二种方式 
            // 1、首先你需要在入口文件引入之后，会通过expose-loader暴露到全局 import $ from "jquery";
            // 2、在其他文件中就可以使用了
            { 
                test: require.resolve("jquery"),
                loader: "expose-loader",
                options: {
                  exposes: ["$", "jQuery"],
                },
            }
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
        // 插件的引入 第一种
        // 这个只是一种向文件中注入变量，而不需要每个文件自己引用
        // 1、webpack配置ProvidePlugin后，在使用时将不再需要import和require进行引入，直接使用即可
        // 2、_ 函数会自动添加到当前模块的上下文，无需显示声明
        // 意思就是说webpack会为每一个文件中注入_这个变量，并不是放在全局的作用域下面，所以在全局中引入会报错
        // 不好的是会把lodash整个库都打包进去，文件就会很大
        new webpack.ProvidePlugin({
            _:'lodash'
        })
    ],
    // 外部环境，不打包
    externals: {
        // 解决想引入jquery但是不想打包到压缩文件中，就排除
        // import $ from 'jquery'; 文件中导入就可以使用了
        jquery: 'jQuery',
    },
}