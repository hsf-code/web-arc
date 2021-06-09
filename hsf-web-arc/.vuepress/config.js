const { sidebar } = require('./config/sidebar.js');
const { nav } = require('./config/nav.js');
const plugins = require('./config/plugins.js');
module.exports = {
  // 配置启动页
  "title": "Himalaya",
  "description": "记录HSF-OWN生活！",
  "dest": "./dist",
  // 头部信息
  "head": [
    [
      // 修改自己的小图标favicon
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ],
    ["link", { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css" }],
    // 引入jquery
    ["script", {
      "language": "javascript",
      "type": "text/javascript",
      "src": "https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"
    }],
    // 引入鼠标点击脚本
    ["script", {
      "language": "javascript",
      "type": "text/javascript",
      "src": "/js/MouseClickEffect.js"
    }]
  ],
  "theme": "reco",
  "themeConfig": {
    "huawei": true,
    "subSidebar": 'auto',//在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容
    ...nav,
    ...sidebar,
    "type": "blog",
    // 导航栏的配置信息
    "blogConfig": {
      // "category": {
      //   // 在导航栏中的位置在第二个
      //   "location": 2,
      //   "text": "分类"
      // },
      // "tag": {
      //   "location": 3,
      //   "text": "标签"
      // }
    },
    "noFoundPageByTencent": false,
    // "friendLink": [
    //   {
    //     "title": "午后南杂",
    //     "desc": "Enjoy when you can, and endure when you must.",
    //     "email": "1156743527@qq.com",
    //     "link": "https://www.recoluan.com"
    //   },
    //   {
    //     "title": "vuepress-theme-reco",
    //     "desc": "A simple and beautiful vuepress Blog & Doc theme.",
    //     "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
    //     "link": "https://vuepress-theme-reco.recoluan.com"
    //   }
    // ],
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "hsf",
    "authorAvatar": "/static/img/hsf.png",
    "record": "xxxx",
    "startYear": "2017"
  },
  "markdown": {
    "lineNumbers": true
  },
  "locales": {
    '/': {
      "lang": 'zh-CN'
    }
  },
  "plugins": [...plugins]
}