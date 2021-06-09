module.exports = [
  [
    //先安装在配置， npm install @vuepress-reco/vuepress-plugin-kan-ban-niang --save
    "@vuepress-reco/vuepress-plugin-kan-ban-niang",
    {
      theme: ['blackCat', 'whiteCat', 'haru1', 'haru2', 'haruto', 'koharu', 'izumi', 'shizuku', 'wanko', 'miku', 'z16'],
      clean: false,
      messages: {
        welcome: '我是lookroot欢迎你的关注 ',
        home: '心里的花，我想要带你回家。',
        theme: '好吧，希望你能喜欢我的其他小伙伴。',
        close: '再见哦'
      },
      width: 240,
      height: 352
    }
  ],
  // 标签加强
  ["vuepress-plugin-boxx"],
  // 更新刷新插件
  ['@vuepress/pwa', {
    serviceWorker: true,
    updatePopup: {
      message: "发现新内容可用",
      buttonText: "刷新"
    }
  }],
  // 音乐插件
  // [
  //   //先安装在配置， npm install vuepress-plugin-meting --save
  //   'meting', {
  //     metingApi: "https://api.i-meto.com/meting/api",
  //     meting: {
  //       server: "netease",
  //       type: "playlist",
  //       mid: "621465725"
  //     },          // 不配置该项的话不会出现全局播放器
  //     // 不配置该项的话不会出现全局播放器
  //     aplayer: {
  //       // 吸底模式
  //       fixed: true,
  //       mini: true,
  //       // 自动播放
  //       autoplay: true,
  //       // 歌曲栏折叠
  //       listFolded: true,
  //       // 颜色
  //       theme: '#f9bcdd',
  //       // 播放顺序为随机
  //       order: 'random',
  //       // 初始音量
  //       volume: 0.1,
  //       // 关闭歌词显示
  //       lrcType: 0
  //     },
  //     mobile: {
  //       // 手机端去掉cover图
  //       cover: false,
  //     }
  //   }],
  // [
  //   //彩带背景 先安装在配置， npm install vuepress-plugin-ribbon --save
  //   "ribbon",
  //   {
  //     size: 90,     // width of the ribbon, default: 90
  //     opacity: 0.8, // opacity of the ribbon, default: 0.3
  //     zIndex: -1    // z-index property of the background, default: -1
  //   }
  // ],
  [
    //鼠标点击特效 先安装在配置， npm install vuepress-plugin-cursor-effects --save
    "cursor-effects",
    {
      size: 3,                    // size of the particle, default: 2
      shape: ['circle'],  // shape of the particle, default: 'star'
      zIndex: 999999999           // z-index property of the canvas, default: 999999999
    }
  ],
  [
    //动态标题 先安装在配置， npm install vuepress-plugin-dynamic-title --save
    "dynamic-title",
    {
      showIcon: "/favicon.ico",
      showText: "(/≧▽≦/)咦！又好了！",
      hideIcon: "/failure.ico",
      hideText: "(●—●)喔哟，崩溃啦！",
      recoverTime: 2000
    }
  ],
  [
    //图片放大插件 先安装在配置， npm install vuepress-plugin-medium-zoom --save
    '@vuepressplugin-medium-zoom', {
      selector: '.page img',
      delay: 1000,
      options: {
        margin: 24,
        background: 'rgba(25,18,25,0.9)',
        scrollOffset: 40
      }
    }
  ],
  // [
  //   //插件广场的流程图插件 先安装在配置 npm install vuepress-plugin-flowchart --save
  //   'flowchart'
  // ],
  // [
  //   //插件广场的sitemap插件 先安装在配置 npm install vuepress-plugin-sitemap --save
  //   'sitemap', {
  //     hostname: 'https://www.glassysky.site'
  //   }
  // ],
  ["vuepress-plugin-nuggets-style-copy", {
    copyText: "复制代码",  //vuepress复制粘贴提示插件P 先安装在配置 npm install vuepress-plugin-nuggets-style-copy --save
    tip: {
      content: "复制成功!"
    }
  }],
  // ["@vuepress-yard/vuepress-plugin-window", {
  //   title: "远方有你伴余生の公告",  //vuepress公告插件 先安装在配置 npm install @vuepress-yard/vuepress-plugin-window --save
  //   contentInfo: {
  //     title: "欢迎进来的小耳朵 🎉🎉🎉",
  //     needImg: true,
  //     imgUrl: "https://reinness.com/avatar.png",
  //     content: "喜欢博皮可以到博客园关注教程",
  //     contentStyle: ""
  //   },
  //   bottomInfo: {
  //     btnText: '关于',
  //     linkTo: 'https://cnblogs.com/glassysky'
  //   },
  //   closeOnce: false
  // }]
]