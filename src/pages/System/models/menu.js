import { queryMenuConfig, addMenu, orderMenu, deleteMenu, updateMenu } from '@/services/api';

export default {
  namespace: 'menu_config',

  state: {
    data: []
  },

  effects: {
    *fetch({ payload,callback}, { call, put }) {
      const response = yield call(queryMenuConfig , payload);
      yield put({
        type: 'list',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addMenu, payload);
      if (callback) callback(response);
    },
    *save({ payload, callback }, { call, put }) {
      const response = yield call(orderMenu, payload);
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteMenu, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateMenu, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    list(state, action) {
      return {
        ...state,
        data:action.payload.data.data,
      };
    },
  },
};
