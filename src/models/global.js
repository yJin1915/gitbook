export default {
  namespace: 'global',

  state: {
    collapsed: false,
    isFullScreen: false,
  },

  effects: {
    *setParam({ data, callback }, { call, put }) {
      yield put({
        type: 'paramData',
        payload: data,
      });
      if (callback) callback(data);
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
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

  subscriptions: {
    setup({ history }) {
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
