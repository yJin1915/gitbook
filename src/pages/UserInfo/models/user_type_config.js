import {
  getUserTypeConfigList,
  addUserTypeConfig,
  queryGame,
  updateUserTypeConfig,
  deleteUserTypeConfig,
} from '@/services/api';

export default {
  namespace: 'user_type_config',

  state: {
    data: {
      list: [],
    },
    appList: [],
    isEdit: false, // 是否编辑状态
    curDetail: {}, // 当前编辑的条目
    updateModalShow: false, // 新增编辑模态框
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getUserTypeConfigList, payload);
      yield put({
        type: 'list',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addUserTypeConfig, payload);
      if (callback) callback(response);
    },
    *modify({ payload, callback }, { call, put }) {
      const response = yield call(updateUserTypeConfig, payload);
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteUserTypeConfig, payload);
      if (callback) callback(response);
    },
    *fetchAppList({ payload, callback }, { call, put }) {
      const response = yield call(queryGame, payload);
      yield put({
        type: '_applist',
        payload: response,
      });
      if (callback) callback(response);
    },
    *setParam({ data, callback }, { call, put }) {
      yield put({
        type: 'paramData',
        payload: data,
      });
      if (callback) callback(data);
    },
  },

  reducers: {
    list(state, action) {
      const listData = action?.payload?.data ?? [];
      return {
        ...state,
        data: {
          list: listData,
        },
      };
    },
    _applist(state, action) {
      return {
        ...state,
        appList: action?.payload?.data ?? [],
      };
    },
    paramData(state, action) {
      if (action.payload && action.payload.pName) {
        return {
          ...state,
          [action.payload.pName]: action.payload.pValue,
        };
      } else {
        return state;
      }
    },
  },
};
