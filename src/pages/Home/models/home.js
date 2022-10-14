import { api } from '@/services/api';

export default {
  namespace: 'home',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *setParam({ data, callback }, { call, put }) {
      yield put({
        type: 'paramData',
        payload: data,
      });
      if (callback) callback(data);
    },
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(api, payload);
      yield put({
        type: '_data',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
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
    _data(state, action) {
      const data = action?.payload?.data ?? {};
      return {
        ...state,
        data: {
          list: data?.data,
          pagination: {
            total: data?.total,
            pageSize: parseInt(data?.page_size, 10),
            current: parseInt(data?.current_page, 10) || 1,
          },
        },
      };
    },
  },
};
