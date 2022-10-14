import { routerRedux } from 'dva/router';
import { getCaptcha, AccountLogin } from '@/services/api';
import { isJsonString } from '@/utils/utils';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    sysName: '',
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      const response = yield call(AccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      if (callback) callback(response);
      // Login successfully
      if (response.status === 0) {
        localStorage._token = response._token;
        localStorage.tabList = JSON.stringify([]);
        const lastRouter = localStorage.getItem('lr');
        let routerKey = '';
        const hasLastRouterKey =
          isJsonString(lastRouter) && JSON.parse(lastRouter) && JSON.parse(lastRouter).key;
        if (hasLastRouterKey && JSON.parse(lastRouter).search) {
          routerKey = `${JSON.parse(lastRouter).key}?${JSON.parse(lastRouter).search}`;
        } else if (hasLastRouterKey && !JSON.parse(lastRouter).search) {
          routerKey = JSON.parse(lastRouter).key;
        } else {
          routerKey = '/';
        }
        yield put(routerRedux.push(routerKey));
      }
    },
    *getCaptcha({ payload, callback }, { call }) {
      const response = yield call(getCaptcha, payload);
      if (callback) callback(response);
    },
    *logout({ payload }, { call, put }) {
      // const response = yield call(AccountLogout, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      const lastRouter = localStorage.getItem('lr');
      localStorage.clear();
      localStorage.setItem('lr', lastRouter);
      yield put(
        routerRedux.push({
          pathname: '/user/login',
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    _sysName(state, action) {
      return {
        ...state,
        sysName: action.payload?.data ?? '',
      };
    },
  },
};
