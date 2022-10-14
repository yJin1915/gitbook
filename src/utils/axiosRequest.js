import axios from 'axios';
import querystring from 'querystring';
import { message } from 'antd';
import Event from '@/utils/Event';

window.axiosCancel = []; // 全局定义一个存放取消请求的标识
const CancelToken = axios.CancelToken;

//拦截请求
axios.interceptors.request.use(config => {
  return config;
});

//拦截响应
axios.interceptors.response.use(config => {
  return config;
});

const postForm = (url, params, callback) => {
  const formData = new FormData();
  for (const key in params) {
    formData.append(key, params[key]);
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      data: formData,
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      //withCredentials: true,
      //credentials: 'same-origin',
      onUploadProgress: progress => {
        callback && callback(progress);
      },
      cancelToken: new CancelToken(function executor(cancel) {
        // executor 函数接收一个 cancel 函数作为参数
        window.axiosCancel.push({ url, cancel });
      }),
    })
      .then(res => {
        if (res.status === 200) {
          resolve(res.data);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

const post = (url, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      data: querystring.stringify(Object.assign({}, params)),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      cancelToken: new CancelToken(function executor(cancel) {
        // executor 函数接收一个 cancel 函数作为参数
        window.axiosCancel.push({ url, cancel });
      }),
      // withCredentials:true
    })
      .then(res => {
        if (res.status == 0 || res.status == 99) {
          return res;
        } else if (res.status == '979899') {
          const hashErrRout = window.location.hash.split('#')[1];
          Event.emit('handle404Page', { hashErrRout });
          // router.push('/exception/404');
          // message.warning('您没有权限访问该页面！');
          // return res;
        } else if (res.status == '999999' || res.status === 419) {
          if (res.status == '999999') {
            // message.error(res.msg);
          }
          window.g_app._store.dispatch({
            type: 'login/logout',
          });
          return;
        } else {
          // message.error(res.msg);
          return res;
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      params: Object.assign({}, { ...params }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      cancelToken: new CancelToken(function executor(cancel) {
        // executor 函数接收一个 cancel 函数作为参数
        window.axiosCancel.push({ url, cancel });
      }),
      // withCredentials:true
    })
      .then(res => {
        if (res.status == 0 || res.status == 99) {
          return res;
        } else if (res.status == '979899') {
          const hashErrRout = window.location.hash.split('#')[1];
          Event.emit('handle404Page', { hashErrRout });
          // router.push('/exception/404');
          // message.warning('您没有权限访问该页面！');
          // return res;
        } else if (res.status == '999999' || res.status === 419) {
          if (res.status == '999999') {
            // message.error(res.msg);
          }
          window.g_app._store.dispatch({
            type: 'login/logout',
          });
          return;
        } else {
          // message.error(res.msg);
          return res;
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const axiosRequest = {
  get,
  post,
  postForm, // 目前上传用
};
