let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let CleanWebpackPlugin = require("clean-webpack-plugin");
let merge = require('webpack-merge')
let htmlPlugins = ["index"].map(chunkName => {
  return new HtmlWebpackPlugin({
    filename: `${chunkName}.html`,
    chunks: [chunkName],
    template: `./public/${chunkName}.html`
  });
});
let base = {
  entry: {
    index: "./src/index.js"
  },
  output: {
    filename: "[name].js"
  },
  performance: false,
  module: {
    rules: [
      {
            test:/\.ts$/,
            use:'ts-loader'
      },
      {
        test:/\.js$/,
        exclude:/node_modules/,
        include:path.resolve(__dirname,'./src'),
        use:{
            loader:'babel-loader', 
            options:{
                presets:[['@babel/preset-env',{
                }]],
                plugins:[
                    ["@babel/plugin-proposal-decorators", { "legacy": true }],
                    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
                ]
            }
        }
      },
      {
        test: /\.html/,
        use: "html-withimg-loader"
      },
      {
        test: /\.(eot|svg|woff2|woff|ttf)/,
        use: "file-loader"
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 2,
            outputPath: "img"
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), ...htmlPlugins,
  ]
};
let dev = require('./webpack.dev');
let prod = require('./webpack.prod');
// 可以通过 --env.xxx设置环境变量 来加载不同的配置文件
// 所谓也就是说当你的script 也就是你在终端输入的命令中可以带有你想要的环境格式
module.exports = (env)=>{
  if(env.production){
    return merge(base,prod)
  }else{
    return merge(base,dev)
  }
}