import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import { getMenuData } from '@/services/api';
import menuRouterData from '../../config/router.config.js';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        // name: formatMessage({ id: locale, defaultMessage: item.name }),
        name: item.name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = (data = []) => {
    if (data && data.length) {
      data.forEach(menuItem => {
        if (menuItem.children) {
          flattenMenuData(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    }
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData({ payload, callback }, { call, put }) {
      const response = menuRouterData[1].routes;
      const { routes, authority } = payload;

      let a = {};
      const mapRoutes = (data = []) => {
        if (data && data.length) {
          data.forEach((v, i) => {
            if (v.component && v.path) {
              a[v.path] = v.component;
            }
            if (v.routes && v.routes.length > 0) {
              mapRoutes(v.routes);
            }
          });
        }
      };
      mapRoutes(routes);
      const mapComponents = (data = []) => {
        if (data && data.length) {
          data.forEach((v, i) => {
            if (v.icon == null || v.icon == undefined || v.icon == '') {
              delete v.icon;
            }
            if (v.component && v.path) {
              v.component = a[v.path];
            }
            if (v.routes && v.routes.length > 0) {
              mapComponents(v.routes);
            }
          });
        }

        return data;
      };
      // let menuRouter = mapComponents(response.data);
      let menuRouter = mapComponents(response);
      const menuData = filterMenuData(memoizeOneFormatter(menuRouter, authority));
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap },
      });
      if (callback) callback(menuRouterData[1].routes);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
