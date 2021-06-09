---
title: 基础（七）
date: 2020-05-29
categories: article
author: hsf
isTimeLine: true
---

# umi

## 1.UmiJS

- [UmiJS](https://umijs.org/zh/guide/) 是一个类 Next.JS 的 react 开发框架。
- 他基于一个约定，即 pages 目录下的文件即路由，而文件则导出 react 组件
- 然后打通从源码到产物的每个阶段，并配以完善的插件体系，让我们能把 umi 的产物部署到各种场景里。

![umiJS](https://camo.githubusercontent.com/6814f490328a0f65734a4913525987a959fd6253/68747470733a2f2f7368697075736572636f6e74656e742e636f6d2f33616138333237306131363061333263313434366263346134323366613330332f506173746564253230496d616765253230322e706e67)

## 2.安装

- [umi源码](https://github.com/umijs/umi)
- [create-umi](https://github.com/umijs/create-umi)
- [umi-plugin-react文档](https://umijs.org/zh/plugin/umi-plugin-react.html)
- [umi-plugin-react源码](https://github.com/umijs/umi/tree/master/packages/umi-plugin-react)
- [umi-plugin-dva](https://github.com/umijs/umi/tree/master/packages/umi-plugin-dva)
- [dva-immer](https://github.com/dvajs/dva/blob/master/packages/dva-immer/src/index.js)
- [immer](https://immerjs.github.io/immer/docs/introduction)
- [umi-blocks](https://github.com/umijs/umi-blocks)
- [pro-blocks](https://github.com/ant-design/pro-blocks)

```js
$ cnpm install -g umi
$ yarn global add umi
$ umi -v
umi@3.2.15
$ yarn global bin
$ npm root -g
```

### 2.1 目录约定

```js
.
├── dist/                          // 默认的 build 输出目录
├── mock/                          // mock 文件所在目录，基于 express
├── config/
    ├── config.js                  // umi 配置，同 .umirc.js，二选一
└── src/                           // 源码目录，可选
    ├── layouts/index.js           // 全局布局
    ├── pages/                     // 页面目录，里面的文件即路由
        ├── .umi/                  // dev 临时目录，需添加到 .gitignore
        ├── .umi-production/       // build 临时目录，会自动删除
        ├── document.ejs           // HTML 模板
        ├── 404.js                 // 404 页面
        ├── page1.js               // 页面 1，任意命名，导出 react 组件
        ├── page1.test.js          // 用例文件，umi test 会匹配所有 .test.js 和 .e2e.js 结尾的文件
        └── page2.js               // 页面 2，任意命名
    ├── global.css                 // 约定的全局样式文件，自动引入，也可以用 global.less
    ├── global.js                  // 可以在这里加入 polyfill
├── .umirc.js                      // umi 配置，同 config/config.js，二选一
├── .env                           // 环境变量
└── package.json
```

## 3. 新建项目

### 3.1 新建项目目录

```js
mkdir zhufeng-umi
cd zhufeng-umi
cnpm init -y
```

### 3.2 新建pages目录

```js
mkdir src/pages
```

### 3.3 新建页面

#### 3.3.1 Home组件

```js
umi g page index
```

pages\index.js

```js
import React, { Component } from 'react'
import { Link } from 'umi';
import styles from './index.css';
export default class componentName extends Component {
  render() {
    return (
      <div>
        <h1 className={styles.title}>首页</h1>
        <Link to="/profile">个人中心</Link>
      </div>
    )
  }
}
```

#### 3.3.2 用户管理

```js
umi g page user
import React from 'react';
import styles from './user.css';

export default () => {
  return (
    <div>
      <h1 className={styles.title}>Page user</h1>
    </div>
  );
}
```

#### 3.3.2 个人中心

```js
umi g page profile
```

pages\profile.js

```js
import React, { Component } from 'react'
import { history } from 'umi';
import styles from './profile.css';
export default class componentName extends Component {
  render() {
    return (
      <div>
        <h1 className={styles.title}>个人中心</h1>
        <button onClick={()=>history.goBack()}>返回</button>
      </div>
    )
  }
}
```

#### 3.3.3 启动服务器

##### 3.3.3.1 启动配置

```json
  "scripts": {
    "dev": "umi dev",
    "build": "umi build"
  }
```

##### 3.3.3.2 启动项目

```js
npm run dev
```

##### 3.3.3.3 部署发布

- ```js
  npm run build
  ```

## 4. 全局 layout

- 约定 `src/layouts/index.js` 为全局路由，返回一个 React 组件，通过 `props.children` 渲染子组件

src/layouts/index.js

```js
import React,{Component} from 'react';
import {Link} from 'umi';
export default class Layout extends Component{
    render() {
        return (
            <div>
                <ul>
          <li><Link to="/" >首页</Link></li>
          <li><Link to="/user">用户管理</Link></li>
                    <li><Link to="/profile">个人设置</Link></li>
                </ul>
                <div>
            {this.props.children}
                </div>
            </div>
        )
    }
}
```

## 5. 用户管理

### 5.1 嵌套路由

- umi 里约定目录下有 _layout.js 时会生成嵌套路由，以 _layout.js 为该目录的 layout pages/user/_layout.js

```js
import React,{Component,Fragment} from 'react';
import {Link} from 'umi';
export default class User extends Component{
    render() {
        return (
            <div >
                <ul>
                    <li><Link to="/user/list">用户列表</Link></li>
                    <li><Link to="/user/add">新增用户</Link></li>
                </ul>
                <div>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
```

### 5.2 user/list.js

/pages/user/list.js

```js
import React,{Component,Fragment} from 'react';
import {Link} from 'umi';
export default class List extends Component{
    render() {
        return (
            <ul>
        <li><Link to="/user/detail/1">张三</Link></li>
        <li><Link to="/user/detail/2">李四</Link></li>
            </ul>
        )
    }
}
```

### 5.3 pages/user/add.js

pages/user/add.js

```js
import React,{Component} from 'react';
export default class Add extends Component{
    render() {
        return (
            <form >
                 <input/>
         <input type="submit" />
            </form>
        )
    }
}
```

### 5.3 动态路由

- 约定 `[]` 包裹的文件或文件夹为动态路由

src\pages\user\detail[id].js

```js
import React,{Component} from 'react';
export default class  extends Component{
    render() {
        console.log(this.props);
        return (
            <table>
                <thead>
                    <tr>
                        <td>字段</td>
                        <td>值</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>张三</td>
                    </tr>
                </tbody>
            </table>
        )
    }
}
```

## 6. 权限路由

- 通过指定高阶组件 `wrappers` 达成效果

### 6.1 profile.js

```diff
import React, { Component } from 'react'
import { history } from 'umi';
import styles from './profile.css';
class Profile extends Component {
  render() {
    return (
      <div>
        <h1 className={styles.title}>个人中心</h1>
        <button onClick={()=>history.goBack()}>返回</button>
      </div>
    )
  }
}

+Profile.wrappers = ['@/wrappers/auth']
+export default Profile;
```

### 6.2 auth.js

src\wrappers\auth.js

```js
import { Redirect } from 'umi';

export default (props) => {
  const isLogin = localStorage.getItem('isLogin');
  if (isLogin) {
    return <div>{ props.children }</div>;
  } else {
    return <Redirect to={{pathname:"/login",state:{from:'/profile'}}} />;
  }
}
```

### 6.3 pages/login.js

pages/login.js

```js
import React from 'react';
import styles from './login.css';
import { history } from 'umi';
export default (props) => {
  return (
    <div>
      <h1 className={styles.title}>Page login</h1>
      <button onClick={()=>{
        localStorage.setItem('isLogin','true');
        if(props.location.state&&props.location.state.from){
          history.push(props.location.state.from);
        }
      }}>登录</button>
    </div>
  );
}
```

## 7. 动态路由

### 7.1 前台运行时

src\app.js

```js
export function patchRoutes({ routes }) {
    routes.unshift({
        path: '/foo',
        exact: true,
        component: require('./Foo').default,
    });
}
```

src\Foo.js

```js
import React, { Component } from 'react'
export default class componentName extends Component {
  render() {
    return (
      <div>
      Foo
      </div>
    )
  }
}
```

### 7.2 接口返回

src\app.js

```js
let extraRoutes;
export  function modifyClientRenderOpts(memo) {
    memo.routes.unshift(...extraRoutes);
    return memo;
}
export function render(oldRender) {
    fetch('/api/routes').then(res => res.json()).then((res) => { 
        extraRoutes = res.map(item=>{
            let component = item.component;
            component = require(`./components/${component}`).default;
            return { ...item, component};
        });
        oldRender();
    })
}
```

mock\routes.js

```js
export default {
    'GET /api/routes': [
        {
            path:'/foo',
            component:'Foo.js'
        }
    ]
}
```

# antpro

## 1.前端项目最佳实践

### 1.1 工具选择

| 类别     | 选择                                                         |
| :------- | :----------------------------------------------------------- |
| 框架     | [react](https://reactjs.org/)                                |
| JS 语言  | [TypeScript](http://www.typescriptlang.org/)                 |
| CSS 语言 | [css-modules](https://github.com/css-modules/css-modules)+[less](http://lesscss.org/)+[postcss](https://github.com/postcss/postcss) |
| JS 编译  | [babel](https://www.babeljs.cn/)                             |
| 模块打包 | [webpack 全家桶](https://webpack.github.io/)                 |
| 单元测试 | [jest](https://github.com/facebook/jest)+[enzyme](https://github.com/airbnb/enzyme)+[puppteer](https://github.com/puppeteer/puppeteer)+[jsdom](https://github.com/jsdom/jsdom) |
| 路由     | [react-router](https://github.com/ReactTraining/react-router) |
| 数据流   | [dva](https://dvajs.com/)+[redux 生态](https://www.redux.org.cn/) |
| 代码风格 | [eslint](https://eslint.org/)+[prettier](https://prettier.io/) |
| JS 压缩  | [TerserJS](https://github.com/terser/terser)                 |
| CSS 压缩 | [cssnano](https://github.com/cssnano/cssnano)                |
| 请求库   | [umi-request](https://github.com/umijs/umi-request#readme)   |
| UI       | [AntDesign](https://ant.design/docs/react/introduce-cn)+[AntDesignPro](https://pro.ant.design/index-cn) |
| 国际化   | [react-intl](https://github.com/formatjs/react-intl)         |
| hooks 库 | [umi-hooks](https://hooks.umijs.org/)                        |
| 静态文档 | [docz](https://www.docz.site/)                               |
| 微前端   | [qiankun](https://github.com/umijs/qiankun)                  |
| 图表库   | [antv](https://antv.vision/)                                 |

### 1.2 技术栈选型

#### 1.2.1 固定化

- React 框架
- TypeScript 语言
- Less+CSS Modules
- Eslint+Prettier+固定配置
- 固定数据流方案 dva
- 固定 babel 插件
- Jest+Enzyme
- 框架版本不允许锁定，^前缀必须有
- 主要依赖不允许自定义依赖版本

#### 1.2.2 配置化

- 不仅是框架功能，还有 UI 界面
- 路由、布局、菜单、导航、面包屑、权限、请求、埋点、错误处理
- 只管写 Page 页面就可以了

##### 1.2.2.1 编译态配置

- 给 node.js 使用，比如 webpack、babel 相关配置，静态路由配置

##### 1.2.2.2 运行态配置

- 给浏览器用、比如渲染逻辑、动态修改路由、获取用户信息

### 1.3 约定化

- 国际化
- 数据流
- MOCK
- 目录结构
- 404
- 权限策略
- Service
- 配置文件

### 1.4 理念

- 通过最佳实践减少不必要的选择的差异
- 通过插件和插件集的架构方式，满足不同场景的业务
- 通过资产市场和场景市场着力解决 70%的开发者问题
- 通过对垂直场景采取强约束的方式，进一步提升研发效率
- 不给选择、配置化、约定化

## 2.Ant Design Pro

- `Ant Design Pro` 是一个企业级中后台前端/设计解决方案，我们秉承 Ant Design 的设计价值观，致力于在设计规范和基础组件的基础上，继续向上构建，提炼出典型模板/业务组件/配套设计资源，进一步提升企业级中后台产品设计研发过程中的『用户』和『设计者』的体验。
- [pro.ant.design](https://pro.ant.design/)
- [beta-pro.ant.design](https://beta-pro.ant.design/index-cn/)
- [procomponents.ant.design](https://procomponents.ant.design/components/table/)
- [getting-started-cn](https://beta-pro.ant.design/docs/getting-started-cn)

### 2.1 启动项目

#### 2.1.1 安装

- 新建一个空的文件夹作为项目目录，并在目录下执行
- [python-380](https://www.python.org/downloads/release/python-380/)

```js
//npm config set python "C:/Python38/python.exe"
yarn create umi
```

#### 2.1.2 目录结构

- 我们已经为你生成了一个完整的开发框架，提供了涵盖中后台开发的各类功能和坑位，下面是整个项目的目录结构。

```js
├─config # umi 配置，包含路由，构建等配置
├─mock   # 本地模拟数据
├─public
│  └─icons
├─src
│  ├─components # 业务通用组件
│  │  ├─Footer
│  │  ├─HeaderDropdown
│  │  ├─HeaderSearch
│  │  ├─NoticeIcon
│  │  └─RightContent
│  ├─e2e       # 集成测试用例
│  ├─locales   # 国际化资源
│  │  ├─en-US
│  │  ├─id-ID
│  │  ├─pt-BR
│  │  ├─zh-CN
│  │  └─zh-TW
│  ├─pages    # 业务页面入口和常用模板
│  │  ├─ListTableList
│  │  │  └─components
│  │  └─user
│  │      └─login
│  ├─services # 后台接口服务
│  └─utils    # 工具库
└─tests       # 测试工具
```

#### 2.1.3 本地开发

```js
npm install
npm start:dev
git init
git add -A
git commit -m"1.init"
```

### 2.2 用户登录

#### 2.2.1 config\proxy.ts

config\proxy.ts

```diff
export default {
  dev: {
    '/api/': {
+     target: 'http://localhost:4000/',
      changeOrigin: true,
      pathRewrite: { '^': '' }
    }
  }
};
```

#### 2.2.2 src\app.tsx

src\app.tsx

```diff
import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings, PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import { history, RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { ResponseError } from 'umi-request';
import { queryCurrent } from './services/user';
import defaultSettings from '../config/defaultSettings';

export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const currentUser = await queryCurrent();
      return currentUser;
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.CurrentUser };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { currentUser } = initialState;
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!currentUser && location.pathname !== '/user/login') {
        history.push('/user/login');
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

export const request: RequestConfig = {
   errorHandler,
+  headers:{
+    Authorization:`Bearer ${localStorage.getItem('token')}`
+  }
};
```

#### 2.2.3 src\services\API.d.ts

src\services\API.d.ts

```diff
declare namespace API {
  export interface CurrentUser {
    avatar?: string;
   username?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    userid?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
  }

  export interface LoginStateType {
    status?: 'ok' | 'error';
    type?: string;
+   token?:string;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }
}
```

#### 2.2.4 login\index.tsx

src\pages\user\login\index.tsx

```diff
import {
  AlipayCircleOutlined,
  LockTwoTone,
  MailTwoTone,
  MobileTwoTone,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, Link, history, FormattedMessage, SelectLang } from 'umi';
import Footer from '@/components/Footer';
import { fakeAccountLogin, getFakeCaptcha, LoginParamsType } from '@/services/login';

import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const goto = () => {
  const { query } = history.location;
  const { redirect } = query as { redirect: string };
  window.location.href = redirect || '/';
};

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [type, setType] = useState<string>('account');
  const intl = useIntl();

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const msg = await fakeAccountLogin({ ...values, type });
+      if (msg.status === 'ok' && msg.token) {
+        localStorage.setItem('token',msg.token);
        message.success('登录成功！');
        goto();
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang}>{SelectLang && <SelectLang />}</div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.svg" />
              <span className={styles.title}>Ant Design</span>
            </Link>
          </div>
          <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'pages.login.submit',
                  defaultMessage: '登录',
                }),
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values);
            }}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane
                key="account"
                tab={intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账户密码登录',
                })}
              />
            </Tabs>

            {status === 'error' && loginType === 'account' && (
              <LoginMessage
                content={intl.formatMessage({
                  id: 'pages.login.accountLogin.errorMessage',
                  defaultMessage: '账户或密码错误（admin/ant.design)',
                })}
              />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.username.placeholder',
                    defaultMessage: '用户名: admin or user',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.username.required"
                          defaultMessage="请输入用户名!"
                        />
                      ),
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockTwoTone className={styles.prefixIcon} />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.login.password.placeholder',
                    defaultMessage: '密码: ant.design',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.login.password.required"
                          defaultMessage="请输入密码！"
                        />
                      )
                    },
                  ]}
                />
              </>
            )}
            <div style={{marginBottom: 24}}></div>
          </ProForm>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
```

## 3.后端

### 3.1 安装依赖

```js
cnpm i express body-parser  jwt-simple cors express-session connect-mongo mongoose axios -S
/api/register
{"name":"admin","password":"123456","autoLogin":true,"type":"account"}
/api/login/account
{"username":"admin","password":"123456"}
```

### 3.2 app.js

```js
let express = require("express");
let bodyParser = require("body-parser");
let jwt = require('jwt-simple');
let cors = require("cors");
let Models = require('./model');
let session = require("express-session");
let MongoStore = require('connect-mongo')(session);
let config = require('./config');
let app = express();
app.use(
    cors({
        origin: config.origin,
        credentials: true,
        allowedHeaders: "Content-Type,Authorization",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
    session({
        secret: config.secret,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            url: config.dbUrl,
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        })
    })
);
app.get('/', async (req, res) => {
    res.json({ code: 0, data: `hello` });
});

app.post('/api/register', async (req, res) => {
    let user = req.body;
    let hash = require('crypto').createHash('md5').update(user.email).digest('hex');
    user.avatar = `https://secure.gravatar.com/avatar/${hash}?s=48`;
    user = await Models.UserModel.create(user);
    res.send({ status: 'ok', currentAuthority: 'user' });
});
app.post('/api/login/account', async (req, res) => {
    let user = req.body;
    let query = {};
    if (user.type == 'account') {
        query.name = user.username;
        query.password = user.password;
    }
    let dbUser = await Models.UserModel.findOne(query);
    if (dbUser) {
        dbUser.userid = dbUser._id;
        let token = jwt.encode(dbUser, config.secret);
        return res.send({ status: 'ok', token, type: user.type, currentAuthority: dbUser.currentAuthority });
    } else {
        return res.send({
            status: 'error',
            type: user.type,
            currentAuthority: 'guest'
        });
    }
});

app.get('/api/currentUser', async (req, res) => {
    let authorization = req.headers['authorization'];
    if (authorization) {
        try {
            let user = jwt.decode(authorization.split(' ')[1], config.secret);
            res.json(user);
        } catch (err) {
            res.status(401).send({});
        }
    } else {
        res.status(401).send({});
    }
});
app.get('/api/login/outLogin', async (req, res) => {
    res.send({ data: {}, success: true });
});
app.listen(4000, () => {
    console.log('服务器在4000端口启动!');
});
```

### 3.3 model.js

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let config = require('./config');
const conn = mongoose.createConnection(config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const UserModel = conn.model('User', new Schema({
    userid: { type: String },
    email: { type: String },//邮箱
    name: { type: String },//用户名
    password: { type: String, required: true },//密码
    avatar: { type: String, required: true },//头像
    currentAuthority: { type: String, required: true,default:'user' }//当前用户的权限
}));

module.exports = {
    UserModel
}
```

### 3.4 config.js

```js
module.exports = {
    secret: 'pro',
    dbUrl: "mongodb://localhost:27017/pro",
    origin: ["http://localhost:8000"]
}
```

### 3.5 package.json

```json
  "scripts": {
    "start": "nodemon app.js"
  }
```

# fiber

## 1. Fiber之前的React

index.js

```js
import React from 'react';
import ReactDOM from 'react-dom';
let element = (
    <div id="A1">
        <div id="B1">
            <div id="C1"></div>
            <div id="C2"></div>
        </div>
        <div id="B2"></div>
    </div>
)
console.log(JSON.stringify(element,null,2));
ReactDOM.render(element,document.getElementById('root'));
let element = {
    "type": "div",
    "key": "A1",
    "props": {
        "id": "A1",
        "children": [
            {
                "type": "div",
                "key": "B1",
                "props": {
                    "id": "B1",
                    "children": [
                        {
                            "type": "div",
                            "key": "C1",
                            "props": { "id": "C1"},
                        },
                        {
                            "type": "div",
                            "key": "C2",
                            "props": {"id": "C2"},
                        }
                    ]
                },
            },
            {
                "type": "div",
                "key": "B2",
                "props": {"id": "B2"},
            }
        ]
    },
}
function render(element, container) {
    let dom = document.createElement(element.type);
    Object.keys(element.props).filter(key => key !== 'children').forEach(key => {
        dom[key] = element.props[key];
    });
    if(Array.isArray(element.props.children)){
        element.props.children.forEach(child=>render(child,dom));
    }
    container.appendChild(dom);
}
render(element, document.getElementById('root'));
```

## 2. 帧

- 目前大多数设备的屏幕刷新率为 60 次/秒
- 当每秒绘制的帧数（FPS）达到 60 时，页面是流畅的,小于这个值时，用户会感觉到卡顿
- 每个帧的预算时间是16.66 毫秒 (1秒/60)
- 每个帧的开头包括样式计算、布局和绘制
- JavaScript执行 Javascript引擎和页面渲染引擎在同一个渲染线程,GUI渲染和Javascript执行两者是互斥的
- 如果某个任务执行时间过长，浏览器会推迟渲染

![lifeofframe](http://img.zhufengpeixun.cn/lifeofframe.jpg)

## 3. 什么是Fiber

- 我们可以通过某些调度策略合理分配CPU资源，从而提高用户的响应速度
- 通过`Fiber`架构，让自己的协调过程变成可被中断。 适时地让出CPU执行权，除了可以让浏览器及时地响应用户的交互

### 3.1 Fiber是一个执行单元

- Fiber是一个执行单元,每次执行完一个执行单元, React 就会检查现在还剩多少时间，如果没有时间就将控制权让出去

![fiberflow](http://img.zhufengpeixun.cn/fiberflow.jpg)

### 3.2 Fiber是一种数据结构

- React目前的做法是使用链表,每个虚拟节点内部表示为一个Fiber

![fiberconstructor](http://img.zhufengpeixun.cn/fiberconstructor.jpg)

## 4.rAF

- [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)回调函数会在绘制之前执行
- `requestAnimationFrame(callback)` 会在浏览器每次重绘前执行 callback 回调, 每次 callback 执行的时机都是浏览器刷新下一帧渲染周期的起点上
- `requestAnimationFrame(callback)` 的回调 callback 回调参数 timestamp 是回调被调用的时间，也就是当前帧的起始时间
- `rAfTime performance.timing.navigationStart + performance.now() 约等于 Date.now()`

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RAF</title>
</head>

<body>
    <div style="background: lightblue;width: 0;height: 20px;"></div>
    <button>开始</button>
    <script>
        /**
         * requestAnimationFrame(callback) 由浏览器专门为动画提供的API
         * cancelAnimationFrame(返回值) 清除动画
         * <16.7 丢帧
         * >16.7 跳跃 卡顿
         */
        const div = document.querySelector('div');
        const button = document.querySelector('button');
        let start;
        function progress(rAfTime) {
            div.style.width = div.offsetWidth + 1 + 'px';
            div.innerHTML = (div.offsetWidth) + '%';
            if (div.offsetWidth < 100) {
                let current = Date.now();
                console.log((current - start)+'ms');
                start = current;
                timer = requestAnimationFrame(progress);
            }
        }
        button.onclick = () => {
            div.style.width = 0;
            start = Date.now();
            requestAnimationFrame(progress);
        }
    </script>
</body>
</html>
```

## 5.requestIdleCallback

- 我们希望快速响应用户，让用户觉得够快，不能阻塞用户的交互
- [requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应
- 正常帧任务完成后没超过16 ms,说明时间有富余，此时就会执行 requestIdleCallback 里注册的任务
- `requestAnimationFrame`的回调会在每一帧确定执行，属于高优先级任务，而`requestIdleCallback`的回调则不一定，属于低优先级任务

![cooperativescheduling2](http://img.zhufengpeixun.cn/cooperativescheduling2.jpg)

```js
window.requestIdleCallback(
  callback: (deaLine: IdleDeadline) => void,
  option?: {timeout: number}
)

interface IdleDeadline {
  didTimeout: boolean // 表示任务执行是否超过约定时间
  timeRemaining(): DOMHighResTimeStamp // 任务可供执行的剩余时间
}
```

- callback：回调即空闲时需要执行的任务，该回调函数接收一个IdleDeadline对象作为入参。其中IdleDeadline对象包含：
  - didTimeout，布尔值，表示任务是否超时，结合 timeRemaining 使用
  - timeRemaining()，表示当前帧剩余的时间，也可理解为留给任务的时间还有多少
- options：目前 options 只有一个参数
  - timeout。表示超过这个时间后，如果任务还没执行，则强制执行，不必等待空闲

```html
<body>
    <script>
        function sleep(duration) {
           let start =Date.now();
           while(start+duration>Date.now()){}
        }
        const works = [
            () => {
                console.log("第1个任务开始");
                sleep(0);//sleep(20);
                console.log("第1个任务结束");
            },
            () => {
                console.log("第2个任务开始");
                sleep(0);//sleep(20);
                console.log("第2个任务结束");
            },
            () => {
                console.log("第3个任务开始");
                sleep(0);//sleep(20);
                console.log("第3个任务结束");
            },
        ];

        requestIdleCallback(workLoop, { timeout: 1000 });
        function workLoop(deadline) {
            console.log('本帧剩余时间', parseInt(deadline.timeRemaining()));
            while ((deadline.timeRemaining() > 1 || deadline.didTimeout) && works.length > 0) {
                performUnitOfWork();
            }

            if (works.length > 0) {
                console.log(`只剩下${parseInt(deadline.timeRemaining())}ms,时间片到了等待下次空闲时间的调度`);
                requestIdleCallback(workLoop);
            }
        }
        function performUnitOfWork() {
            works.shift()();
        }
    </script>
</body>
```

## 6.MessageChannel

- 目前 requestIdleCallback 目前只有Chrome支持
- 所以目前 React利用 MessageChannel模拟了requestIdleCallback，将回调延迟到绘制操作之后执行
- MessageChannel API允许我们创建一个新的消息通道，并通过它的两个MessagePort属性发送数据
- MessageChannel创建了一个通信的管道，这个管道有两个端口，每个端口都可以通过postMessage发送数据，而一个端口只要绑定了onmessage回调方法，就可以接收从另一个端口传过来的数据
- MessageChannel是一个宏任务

![phones](http://img.zhufengpeixun.cn/phones.png)

```js
var channel = new MessageChannel();
//channel.port1
//channel.port2
var channel = new MessageChannel();
var port1 = channel.port1;
var port2 = channel.port2;
port1.onmessage = function(event) {
    console.log("port1收到来自port2的数据：" + event.data);
}
port2.onmessage = function(event) {
    console.log("port2收到来自port1的数据：" + event.data);
}
port1.postMessage("发送给port2");
port2.postMessage("发送给port1");
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>
        const channel = new MessageChannel()
        let pendingCallback;//等待执行的callback
        let activeFrameTime = (1000 / 60);//在每秒60帧的情况下每帧的时间
        //当前帧的剩余时间是frameDeadline减去当前时间的差值来判断
        let timeRemaining = () => frameDeadline - performance.now();
        channel.port2.onmessage = () => {
            var currentTime = performance.now();
            var didTimeout = frameDeadline  <= currentTime;
            if(didTimeout || timeRemaining()>1){
                if (pendingCallback) {
                  pendingCallback({ didTimeout: frameDeadline  <= currentTime, timeRemaining });
                }
            }
        }
        window.requestIdleCallback = (callback, options) => {
            requestAnimationFrame((rafTime) => {//当前动画帧开始的时间
                frameDeadline = rafTime + activeFrameTime;
                pendingCallback = callback;
                //把任务推入event loop的task queue中等待执行
                channel.port1.postMessage('hello');
            })
        }

        function sleep(d) {
            for (var t = Date.now(); Date.now() - t <= d;);
        }
        const works = [
            () => {
                console.log("第1个任务开始");
                sleep(20);//sleep(20);
                console.log("第1个任务结束");
            },
            () => {
                console.log("第2个任务开始");
                sleep(20);//sleep(20);
                console.log("第2个任务结束");
            },
            () => {
                console.log("第3个任务开始");
                sleep(0);//sleep(20);
                console.log("第3个任务结束");
            },
        ];

        requestIdleCallback(workLoop, { timeout: 60 * 1000 });
        function workLoop(deadline) {
            console.log('本帧剩余时间', parseInt(deadline.timeRemaining()));
            while ((deadline.timeRemaining() > 1 || deadline.didTimeout) && works.length > 0) {
                performUnitOfWork();
            }
            if (works.length > 0) {
                console.log(`只剩下${parseInt(deadline.timeRemaining())}ms,时间片到了等待下次空闲时间的调度`);
                requestIdleCallback(workLoop, { timeout: 2 * 1000 });
            }
        }
        function performUnitOfWork() {
            works.shift()();
        }
    </script>
</body>

</html>
```

## 7.Fiber执行阶段

- 每次渲染有两个阶段：Reconciliation(协调render阶段)和Commit(提交阶段)
  - 协调阶段: 可以认为是 Diff 阶段, 这个阶段可以被中断, 这个阶段会找出所有节点变更，例如节点新增、删除、属性变更等等, 这些变更React 称之为副作用(Effect)
  - 提交阶段: 将上一个阶段计算出来的需要处理的副作用(Effects)一次性执行了。这个阶段必须同步执行，不能被打断

### 7.1 render阶段

- 从顶点开始遍历
- 如果有第一个儿子，先遍历第一个儿子
- 如果没有第一个儿子，标志着此节点遍历完成
- 如果有弟弟遍历弟弟
- 如果有没有下一个弟弟，返回父节点标识完成父节点遍历，如果有叔叔遍历叔叔
- 没有父节点遍历结束
- 先儿子，后弟弟，再叔叔,辈份越小越优先
- 什么时候一个节点遍历完成? 没有子节点，或者所有子节点都遍历完成了
- 没爹了就表示全部遍历完成了

![fiberconstructortranverse3](http://img.zhufengpeixun.cn/fiberconstructortranverse3.jpg)

```js
let A1 = { type: 'div', props:{id: 'A1'} };
let B1 = { type: 'div', props:{id: 'B1'}, return: A1 };
let B2 = { type: 'div', props:{id: 'B2'}, return: A1 };
let C1 = { type: 'div', props:{id: 'C1'}, return: B1 };
let C2 = { type: 'div', props:{id: 'C2'}, return: B1 };
A1.child = B1;
B1.sibling = B2;
B1.child = C1;
C1.sibling = C2;

//下一个工作单元
let nextUnitOfWork = null;
//render工作循环
function workLoop() {
    while (nextUnitOfWork) {
        //执行一个任务并返回下一个任务
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    console.log('render阶段结束');
    //render阶段结束
}
function performUnitOfWork(fiber) {
    let child = beginWork(fiber);
    if(child){
      return child;
    }
    while (fiber) {//如果没有子节点说明当前节点已经完成了渲染工作
        completeUnitOfWork(fiber);//可以结束此fiber的渲染了 
        if (fiber.sibling) {//如果它有弟弟就返回弟弟
            return fiber.sibling;
        }
        fiber = fiber.return;//如果没有弟弟让爸爸完成，然后找叔叔
    }
}
function beginWork(fiber) {
    console.log('beginWork', fiber.props.id);
    return fiber.child;
}
function completeUnitOfWork(fiber) {
    console.log('completeUnitOfWork', fiber.props.id);
}
nextUnitOfWork = A1;
workLoop();
```

### 7.2 commit阶段

![fibereffectlist4](http://img.zhufengpeixun.cn/fibereffectlist4.jpg)

```js
let container = document.getElementById('root');
let C1 = { type: 'div', props: { id: 'C1', children: [] } };
let C2 = { type: 'div', props: { id: 'C2', children: [] } };
let B1 = { type: 'div', props: { id: 'B1', children: [C1, C2] } };
let B2 = { type: 'div', props: { id: 'B2', children: [] } };
let A1 = { type: 'div', props: { id: 'A1', children: [B1, B2] } };

let nextUnitOfWork = null;
let workInProgressRoot = null;
function workLoop() {
    while (nextUnitOfWork) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }
    if (!nextUnitOfWork) { //render阶段结束
        commitRoot();
    }
}
function commitRoot() {
    let fiber = workInProgressRoot.firstEffect;
    while (fiber) {
        console.log(fiber.props.id); //C1 C2 B1 B2 A1
        commitWork(fiber);
        fiber = fiber.nextEffect;
    }
    workInProgressRoot = null;
}
function commitWork(currentFiber) {
    currentFiber.return.stateNode.appendChild(currentFiber.stateNode);
}
function performUnitOfWork(fiber) {
    beginWork(fiber);
    if (fiber.child) {
        return fiber.child;
    }
    while (fiber) {
        completeUnitOfWork(fiber);
        if (fiber.sibling) {
            return fiber.sibling;
        }
        fiber = fiber.return;
    }
}
function beginWork(currentFiber) {
    if (!currentFiber.stateNode) {
        currentFiber.stateNode = document.createElement(currentFiber.type);//创建真实DOM
        for (let key in currentFiber.props) {//循环属性赋赋值给真实DOM
            if (key !== 'children' && key !== 'key')
                currentFiber.stateNode[key]=currentFiber.props[key];
        }
    }
    let previousFiber;
    currentFiber.props.children.forEach((child, index) => {
        let childFiber = {
            type: child.type,
            props: child.props,
            return: currentFiber,
            effectTag: 'PLACEMENT',
            nextEffect: null
        }
        if (index === 0) {
            currentFiber.child = childFiber;
        } else {
            previousFiber.sibling = childFiber;
        }
        previousFiber = childFiber;
    });
}
function completeUnitOfWork(currentFiber) {
    const returnFiber = currentFiber.return;
    if (returnFiber) {
        if (!returnFiber.firstEffect) {
            returnFiber.firstEffect = currentFiber.firstEffect;
        }
        if (currentFiber.lastEffect) {
            if (returnFiber.lastEffect) {
                returnFiber.lastEffect.nextEffect = currentFiber.firstEffect;
            }
            returnFiber.lastEffect = currentFiber.lastEffect;
        }

        if (currentFiber.effectTag) {
            if (returnFiber.lastEffect) {
                returnFiber.lastEffect.nextEffect = currentFiber;
            } else {
                returnFiber.firstEffect = currentFiber;
            }
            returnFiber.lastEffect = currentFiber;
        }
    }
}

workInProgressRoot = {
    key: 'ROOT',
    stateNode: container,
    props: { children: [A1] }
};
nextUnitOfWork = workInProgressRoot;//从RootFiber开始，到RootFiber结束
workLoop();
```

