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
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                  'file-loader',
                  {
                    // mozjpeg — Compress JPEG images
                    // optipng — Compress PNG images
                    // pngquant — Compress PNG images
                    // svgo — Compress SVG images
                    // gifsicle — Compress GIF images
                    loader: 'image-webpack-loader',
                    options: {
                        // 压缩jpeg图片
                      mozjpeg: {
                        progressive: true,
                      },
                      // optipng.enabled: false will disable optipng
                    //   压缩png
                      optipng: {
                        enabled: false,
                      },
                    //  对png压缩的优化 
                      pngquant: {
                        quality: [0.65, 0.90],
                        speed: 4
                      },
                    //   gif图片的优化
                      gifsicle: {
                        interlaced: false,
                      },
                    //   webp — Compress JPG & PNG images into WEBP
                      // the webp option will enable WEBP
                      webp: {
                        quality: 75
                      }
                    }
                  },
                ],
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
    ],
}