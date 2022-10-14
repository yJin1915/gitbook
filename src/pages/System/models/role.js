import { queryRole, addRole,  deleteRole, updateRole, getRoleMenu } from '@/services/api';

export default {
  namespace: 'role',
  state: {
    data: []
  },

  effects: {
    *fetch({ payload,callback}, { call, put }) {
      const response = yield call(queryRole , payload);
      yield put({
        type: 'list',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRole, payload);
      if (callback) callback(response);
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteRole, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRole, payload);
      if (callback) callback(response);
    },
    *getRoleMenuList({ payload, callback }, { call, put }) {
      const response = yield call(getRoleMenu, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    list(state, action) {
      return {
        ...state,
        data:action.payload.data,
      };
    },
  },
};
