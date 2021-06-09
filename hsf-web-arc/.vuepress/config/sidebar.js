const sidebar = {
  // 侧边栏的导航信息
  "sidebar": {
    "/docs/page-main-content/": [
      {
        "title": '简介',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "",
          "theme",
          "plugin",
          "api"
        ]
      }
    ],
    "/docs/basic/": [
      {
        "title": '前言',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "history",
          "http-https-http2",
        ]
      }
    ],
    "/docs/basics/css/": [
      {
        "title": '基础',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic1",
          "basic2",
          "basic3",
          "basic4",
          "basic5",
          "basic6",
          "basic7",
          "basic8",
          "basic9",
          "basic10",
          "basic11",
        ]
      }
    ],
    "/docs/basics/js/": [
      {
        "title": 'JS基础',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [
          "js-basic/variable",
          "js-basic/basicType",
          "js-basic/function",
          "js-basic/object",
          "js-basic/innerObject",
          "js-basic/compile",
          "js-basic/eventLoop",
          "js-basic/dom",
          "js-basic/bom",
          "js-basic/regx",
          "js-basic/array",
          "js-basic/other",
          "js-basic/basic1",
          "js-basic/basic2",
          "js-basic/basic3",
          "js-basic/basic4",
          "js-basic/async",
          "js-basic/module",
          "js-basic/ES2015",
        ]
      },
      {
        "title": 'Promise',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [
          "promise/basic",
          "promise/basic1",
          "promise/basic2",
          "promise/basic3",
          "promise/basic4",
          "promise/basic5",
          "promise/basic6",
          "promise/basic7",
          "promise/basic8",
          "promise/basic9",
        ]
      },
      {
        "title": 'Demo',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [
          "demo/upload"
        ]
      },
      {
        "title": 'Ajax',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [
          "ajax/basic"
        ]
      },
      {
        "title": 'DOM',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [
          "dom/basic"
        ]
      },
      {
        "title": 'BOM',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [
          "bom/basic"
        ]
      },
      {
        "title": '设计模式',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [
          "designPatterns/basic1",
          "designPatterns/basic2",
          "designPatterns/basic3",
          "designPatterns/basic4",
          "designPatterns/basic5",
          "designPatterns/basic6",
          "designPatterns/basic7",
          "designPatterns/basic8",
          "designPatterns/basic9",
          "designPatterns/basic10",
          "designPatterns/basic11",
          "designPatterns/basic12",
          "designPatterns/basic13",
          "designPatterns/basic14",
          "designPatterns/basic15",
          "designPatterns/basic16",
          "designPatterns/basic17",
          "designPatterns/basic18",
          "designPatterns/basic19",
        ]
      },
      {
        "title": 'Tool',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [
          "tool/basic1",
          "tool/basic2",
          "tool/basic3",
          "tool/basic4",
          "tool/basic5",
          "tool/basic6",
          "tool/basic7",
          "tool/basic8",
          "tool/basic9",
          "tool/basic10",
        ]
      },
    ],
    "/docs/vue/": [
      {
        "title": 'VUE基础',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic/vueUse",
          "basic/basic1",
          "basic/basic2",
          "basic/basic3",
          "basic/componentCommunication",
          "basic/renderUseJSX",
          "basic/JWTCertification",
          "basic/unitTesting",
          "basic/pwa",
          "basic/vueUseRouter",
        ]
      },
      {
        "title": 'VUE路由',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic/2.0router/basic1",
        ]
      },
      {
        "title": 'VUE插件',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic/plugins/axios",
          "basic/plugins/vuex",
        ]
      },
      {
        "title": 'VUE-SSR',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic/ssr/basic1",
          "basic/ssr/nuxt",
        ]
      },
      {
        "title": 'UI',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          // "basic/UI/axios",
        ]
      },
      {
        "title": 'VUE面试题',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "interview/basic1",
          "interview/basic2"
        ]
      },
      {
        "title": 'VUE2.0解析',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "parser/vue2.0/VueMountingInstanceProcedure",
          "parser/vue2.0/$nextTick",
          "parser/vue2.0/basic1",
          "parser/vue2.0/basic2",
          "parser/vue2.0/routerParser"
        ]
      },
      {
        "title": '项目搭建',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "project/setUp",
          "project/optimize1",
          "basic/buildingComponentLibraries",
          "basic/vueCreatePro",
        ]
      },
      {
        "title": '路由',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "parser/vue2.0/router/basic1",
        ]
      },
      {
        "title": 'VUE的使用',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "vueDev/basic1",
        ]
      },
      {
        "title": '前端自动化测试',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "test/basic1",
        ]
      },
      {
        "title": '3.0',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "3.0/basic1",
        ]
      }
    ],
    "/docs/react/": [
      {
        "title": 'React基础',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic/basic1",
          "basic/basic2",
          "basic/basic3",
          "basic/basic4",
          "basic/basic5",
          "basic/basic6",
          "basic/basic7",
          "basic/basic8",
          "basic/basic9",
          "basic/basic10",
        ]
      },
    ],
    "/docs/net/": [
      {
        "title": '基础',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic/1",
          "basic/2",
          "basic/3",
          "basic/tcp",
          "basic/http1",
          "basic/http2",
          "basic/compress",
          "basic/crypto",
          "basic/process",
          "basic/yargs",
          "basic/cache",
          "basic/action",
          "basic/https",
          "basic/cookie",
          "basic/session",
        ]
      },
    ],
    "/docs/backend/node/": [
      {
        "title": "node基础",
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic/basic1",
          "basic/basic2",
          "basic/buffer",
          "basic/fs",
          "basic/stream",
          "basic/jwt",
          "basic/websocket",
        ]
      },
      {
        "title": "Express",
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "framework/express/basic1",
          "framework/express/basic2",
          // "basic/buffer",
          // "basic/fs",
          // "basic/stream",
        ]
      },
      {
        "title": "Koa",
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "framework/koa/basic1",
          // "framework/koa/basic2",
          // "basic/buffer",
          // "basic/fs",
          // "basic/stream",
        ]
      },
      {
        "title": "Egg",
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "framework/egg/basic1",
          // "framework/koa/basic2",
          // "basic/buffer",
          // "basic/fs",
          // "basic/stream",
        ]
      },
      {
        "title": "项目",
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "project/deploy",
          "project/docker",
          "project/elastic",
          "project/enzyme",
          "project/nginx",
          "project/oauth",
          "project/safe",
          "project/test",
          "project/wxpay",
          // "framework/koa/basic2",
          // "basic/buffer",
          // "basic/fs",
          // "basic/stream",
        ]
      },

    ],
    "/docs/interview/web/": [
      {
        "title": '基础',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic/basic1",
        ]
      },
      {
        "title": 'JS系列',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic/basicData",
          "basic/function",
          "basic/object",
          "basic/regx",
          "basic/module",
          "basic/memory",
          "basic/jsdeep",
          "basic/es6",
          "basic/array",
          "basic/browser",
          "basic/css1",
          "basic/dom",
          "basic/jsexample",
          "basic/promise",

        ]
      },
      {
        "title": 'VUE系列',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "vue/basic1",
        ]
      },
      {
        "title": 'Net系列',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "net/basic1",
        ]
      },
    ],
    "/docs/projectDev/": [
      {
        "title": '实例1',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "dev1/basic1",
          "dev1/basic2",
          "dev1/basic3",
          "dev1/basic4",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
        ]
      },
    ],
    "/docs/common/": [
      {
        "title": '基本知识',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic/basic1",
          "basic/basic2",
          "basic/basic3",
          "basic/basic4",
          "basic/basic5",
          "basic/basic6",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
          // "dev1/basic1",
        ]
      },
    ],
    "/docs/frontTools/": [
      {
        "title": '技巧1',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "dev/basic1",
          "dev/basic2",
          "dev/basic3",
          "dev/basic4",
          "dev/basic5",
          "dev/basic6",
          "dev/basic7",
          "dev/basic8",
          "dev/basic9",
          "dev/basic10",
          "dev/basic11",
          "dev/basic12",
          "dev/basic13",
          "dev/basic14",
          "dev/basic15",
          "dev/basic16",
          "dev/basic17",
          "dev/basic18",
          "dev/basic19",
          "dev/basic20",
        ]
      },
    ],
    "/docs/browser/": [
      {
        "title": '基础（一）',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "chrome/basic1",
          "chrome/basic2",
          "chrome/basic3",
          "chrome/basic4",
          "chrome/basic5",
          "chrome/basic6",
          "chrome/basic7",
          "chrome/basic8",
          "chrome/basic9",
          "chrome/basic11",
          "chrome/basic12",
          "chrome/basic13",
          "chrome/basic14",
          "chrome/basic15",
          "chrome/basic16",
          "chrome/basic17",
          "chrome/basic18",
          "chrome/basic19",
          "chrome/basic20",
          "chrome/basic21",
        ]
      },
    ],
    "/docs/projectManagementTools/": [
      {
        "title": '基础（一）',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "git/basic1",
          "git/basic2",
          "git/basic3",
          "git/basic4",
          "git/basic5",
          // "chrome/basic6",
          // "chrome/basic7",
          // "chrome/basic8",
          // "chrome/basic9",
          // "chrome/basic11",
          // "chrome/basic12",
          // "chrome/basic13",
          // "chrome/basic14",
          // "chrome/basic15",
          // "chrome/basic16",
          // "chrome/basic17",
          // "chrome/basic18",
          // "chrome/basic19",
          // "chrome/basic20",
          // "chrome/basic21",
        ]
      },
    ],
    "/docs/npm/": [
      {
        "title": '基础（一）',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic/basic1",
          "basic/basic2",
          "basic/basic3",
          // "basic/basic4",
          // "basic/basic5",
        ]
      },
    ],
    "/docs/frontendBuildTools/": [
      {
        "title": 'webpack',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "webpack/basic1",
          "webpack/basic2",
          "webpack/basic3",
          "webpack/basic4",
          "webpack/basic5",
          "webpack/basic6",
          "webpack/basic7",
          "webpack/basic8",
          "webpack/basic9",
          "webpack/basic10",
        ]
      },
      {
        "title": 'webpack深度分析',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "webpack/advance/basic1",
          "webpack/advance/basic2",
          "webpack/advance/basic3",
          "webpack/advance/basic4",
          "webpack/advance/basic5",
          "webpack/advance/basic6",
          "webpack/advance/basic7",
          "webpack/advance/basic8",
          // "webpack/advance/basic9",
          // "webpack/advance/basic10",
        ]
      },
    ],
    "/docs/performanceOptimization/web/": [
      {
        "title": '基础优化',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "performance",
          "monitor",
          "MobileSoftKeyboard",
          "mobileRecommendation",
        ]
      }
    ],
    "/docs/self/": [
      {
        "title": '工作总结',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
        ]
      }
    ],
    "/docs/project/web/": [
      {
        "title": '基础项目',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          ""
        ]
      },
      {
        "title": 'Vue项目',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          ""
        ]
      },
      {
        "title": 'React项目',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          ""
        ]
      }
    ],
    "/docs/algorithm/web/": [
      {
        "title": '算法基础',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic1"
        ]
      },
    ],
    "/docs/advanced/typescript/": [
      {
        "title": '基础',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic1",
          "basic2",
          "basic3",
          "basic4",
          "basic5",
          "basic6",
          "basic7",
          "basic8",
          "basic9",
          "basic10",
        ]
      },
    ],
    "/docs/advanced/js++/": [
      {
        "title": 'js++（一）',    // 标题信息
        "collapsable": true,   // 是否可折叠
        "children": [        // 该块内容对应的所有链接
          "basic1",
          "basic2",
          "basic3",
          "basic4",
          "basic5",
          "basic6",
          "basic7",
          "basic8",
          "basic9",
          "basic10",
          "basic11",
        ]
      },
    ],
  },
}

module.exports = { sidebar }