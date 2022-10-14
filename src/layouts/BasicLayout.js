import React, { Fragment } from 'react';
import router from 'umi/router';
import { Route } from 'react-router-dom';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
// import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import SiderMenu from '@/components/SiderMenu';
import styles from './BasicLayout.less';
import { deepClone, isJsonString, isEmptyObject, findIndexWithAttr } from '@/utils/utils';
import Event from '@/utils/Event';

const { Content } = Layout;

const rout404 = '/exception/404';

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    const { routes } = props.route;
    const { location } = this.props.history;
    const curpath = location.pathname;
    const cursearch = location.search;
    const tabLists = this.updateTree(routes);

    let tabList = localStorage.tabList ? JSON.parse(localStorage.tabList) : [];
    const lastRouter = localStorage.getItem('lr');

    if (
      lastRouter &&
      isJsonString(lastRouter) &&
      JSON.parse(lastRouter) != null &&
      !isEmptyObject(JSON.parse(lastRouter)) &&
      tabList.filter(x => x.key === JSON.parse(lastRouter).key).length === 0
    ) {
    }
    let locaSearchObjStorage = localStorage.locationSearchObj
      ? JSON.parse(localStorage.locationSearchObj)
      : {};
    const routeKey = tabList.length == 0 || curpath == '/' ? '/customer/management/index' : curpath;
    let tabListKey = [curpath];
    tabLists.map(v => {
      if (v && v.key && v.key === routeKey) {
        if (tabList.length === 0) {
          v.tab = '系统首页';
          tabList.push(v);
        }
      }
      tabList.forEach(vv => {
        if (v && v.key && vv && vv.key && vv.key == v.key) {
          vv.content = v.content;
        }
      });
      tabListKey = tabList.map(v => (v && v.key ? v.key : ''));
    });
    this.state = {
      tabList: tabList,
      tabListKey: tabListKey,
      activeKey: curpath,
      routeKey,
      locaSearchObj: Object.assign(locaSearchObjStorage, { [curpath]: cursearch }),
    };
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    localStorage.setItem('locationSearchObj', JSON.stringify(this.state.locaSearchObj));
  }

  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    // if (!localStorage.tabList || !localStorage._token) {
    // if (!localStorage.tabList) {
    //   const lastRouter = localStorage.getItem('lr');
    //   localStorage.clear();
    //   localStorage.setItem('lr', lastRouter);
    //   router.push('/user/login');
    //   return;
    // }
    dispatch({
      type: 'menu/getMenuData',
      payload: { _token: localStorage._token, routes },
    });

    if (this.props.location.pathname == '/') {
      router.push('/customer/management/index');
    }

    Event.on('handle404Page', rout => {
      const { tabList } = this.state;

      let copyTableList = deepClone(tabList);
      const opIndex = tabList.findIndex(x => x.key === rout.hashErrRout);
      if (opIndex > -1) {
        copyTableList.splice(opIndex, 1);
        this.setState({ tabList: copyTableList }, function() {
          this.onHandlePage({ key: rout404 });
        });
      }
    });
  }

  componentDidUpdate(preProps) {
    if (this.props.location.pathname !== preProps.location.pathname) {
      const { search, pathname } = this.props.location;
      this.onHandlePage({ key: `${pathname}${search ? search : ''}` });
    }
  }

  componentWillUnmount() {
    Event.remove('handle404Page');
  }

  updateTree = (data, curParams = {}) => {
    const treeData = data;
    const treeList = [];
    // 递归获取树列表
    // console.log(treeData);
    const getTreeList = data => {
      data.forEach(node => {
        if (!node.level && node.path) {
          treeList.push({
            tab: node.name,
            key: node.path,
            content: node.component,
            search: curParams,
          });
        }
        if (node.routes && node.routes.length > 0) {
          getTreeList(node.routes);
        }
      });
    };
    getTreeList(treeData);
    return treeList;
  };

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);
    const projName = localStorage.getItem('projname') || '';

    if (!currRouterData) {
      return projName;
    }
    const pageName = currRouterData.name;
    return `${pageName} ${projName ? `- ${projName}` : ''}`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  //截取路由 '/a/b/?id=121'
  StringToRoute = v => {
    const str = /\/:(.+)/g;
    const key = v.replace(str, (_, g) => '');
    const keyArr = key.split('?');
    const keyString = [keyArr[0]];
    return keyString.toString().replace(/,/g, '');
  };

  onHandlePage = e => {
    const { location, menuData } = this.props;
    const parentPath = e.keyPath ? deepClone(e.keyPath).pop() : '';
    const subMenuIndex = findIndexWithAttr(menuData, 'path', parentPath);
    const locaSearchObj = localStorage.locationSearchObj
      ? JSON.parse(localStorage.locationSearchObj)
      : {};
    let curRouter = e.key ? e.key.split('?')[0] : '/customer/management/index';
    //点击左侧菜单
    this.setState(
      {
        locaSearchObj: Object.assign(locaSearchObj, {
          [location.pathname]: location.search,
        }),
        subSideMenuData: (menuData[subMenuIndex] && menuData[subMenuIndex].routes) || [],
      },
      function() {
        localStorage.setItem('locationSearchObj', JSON.stringify(this.state.locaSearchObj));
      }
    );

    const { key } = e;
    const tabLists = this.updateTree(menuData);
    const { tabListKey } = this.state;
    let tempTabList = this.state.tabList;
    if (key.indexOf('http') != -1 || key.indexOf('https') != -1) {
      return;
    }
    const locationSearchObj = JSON.parse(localStorage.getItem('locationSearchObj'));

    router.push(
      `${key}${locationSearchObj && locationSearchObj[key] ? locationSearchObj[key] : ''}`
    );
    let splitKey = this.StringToRoute(key);
    this.setState({ activeKey: splitKey });
    tabLists.map(v => {
      if (v.key === splitKey) {
        if (tempTabList.length === 0) {
          tempTabList.push(v);
        } else {
          if (!tabListKey.includes(v.key)) {
            for (let i = 0; i < tempTabList.length; i++) {
              if (tempTabList[i].key == v.key) {
                break;
              }
            }
            tempTabList.push(v);
          }
        }
      }
    });
    this.setState({
      tabListKey: tempTabList.map(va => va.key),
      tabList: tempTabList,
    });
    localStorage.tabList = JSON.stringify(tempTabList);
    const lastRouterObj = tempTabList
      .filter(x => x && x.key && x.key === curRouter && x.key !== rout404)
      .pop();
    if (lastRouterObj && !isEmptyObject(lastRouterObj)) {
      localStorage.setItem('lr', JSON.stringify(lastRouterObj)); // 记录当前路由
    }
  };

  render() {
    const {
      navTheme,
      location: { pathname },
      menuData,
      breadcrumbNameMap,
    } = this.props;
    let { activeKey, routeKey, tabList } = this.state;
    if (pathname === '/') {
      activeKey = routeKey;
    }

    this.props.location.onHandlePage = this.onHandlePage;
    const allRouters = this.updateTree(this.props.route.routes) || [];
    const layout = (
      <Layout>
        <SiderMenu
          // logo={logo}
          theme={navTheme}
          onCollapse={this.handleMenuCollapse}
          menuData={menuData}
          {...this.props}
          onHandlePage={this.onHandlePage}
        />
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            // logo={logo}
            {...this.props}
          />

          <Content className={styles.content}>
            {allRouters && allRouters.length ? (
              <Fragment>
                {allRouters.map(item => {
                  if (item.key === activeKey) {
                    return (
                      <Route
                        key={item.key}
                        path={item.path}
                        component={item.content}
                        exact={item.exact}
                      />
                    );
                  }
                })}
              </Fragment>
            ) : 11}
          </Content>
          {/* <Footer /> */}
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
          <Context.Provider value={this.getContext()}>{layout}</Context.Provider>
        </DocumentTitle>
      </React.Fragment>
    )
  }
}

export default connect(({ global, setting, menu }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menu.menuData,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  ...setting,
}))(props => <BasicLayout {...props} />);
