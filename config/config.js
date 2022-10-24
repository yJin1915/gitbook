// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';
// let proxyBase = 'https://intermediate.gamehualing.com'; // 开发接口代理地址
// let proxyBase = 'http://47.98.211.160/'; // 开发接口代理地址
let proxyBase = 'http://192.168.50.35:8080/'; // 开发接口代理地址

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'en-US', // default zh-CN
        baseNavigator: false, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
      },
      pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
          importWorkboxFrom: 'local',
        },
      },
      ...(!process.env.TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
          }
        : {}),
    },
  ],
];
const proxyArr = [
  // 接口代理
  '/admin',
];


export default {
  // add for transfer to umi
  history: 'hash',
  hash: true,
  plugins,
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
    BUILD_TYPE: process.env.BUILD_TYPE || '',
  },
  publicPath: process.env.BUILD_TYPE === 'pro' ? './' : './',
  // publicPath: process.env.BUILD_TYPE === 'pro' ? 'https://admin.gamehualing.com/' : './',
  targets: {
    ie: 11,
    android: 4,
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // 配置代理
  proxy: {
    '/admin': {
      target: proxyBase,
      pathRewrite: { '^/admin': '/admin' },
      changeOrigin: true
    },
    '/partner': {
      target: proxyBase,
      pathRewrite: { '^/partner': '/partner' },
      changeOrigin: true
    }
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('.css') || //解决CSS文件加载失败的问题
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  uglifyJSOptions: {
    uglifyOptions: {
      compress: {
        drop_console: true,
        pure_funcs: ['console.error', 'console.warn'],
      },
    },
  },

};
