import fetch from 'dva/fetch';
import { notification } from 'antd';
import hash from 'hash.js';
import { message } from 'antd';
import {storage} from './utils'
import router from 'umi/router';
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  403:'没有操作权限',
  486: '用户不存在',
  480: '密码错误',
  487: '账号被锁定',
  500: '服务器发生错误，请检查服务器。',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300 && response.status != 419) {
    return response;
  }
  if (response.status == 419) {
    window.location.reload();
    window.g_app._store.dispatch({
      type: 'login/logout',
    });
    return;
  }
  const errortext = codeMessage[response.code] || response.statusText;
  notification.error({
    message: `${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request( fmtUrl, option) {
  //  var url=`https://intermediate.gamehualing.com${fmtUrl}`
  //  var url=`${fmtUrl}`
  //  var url=`http://47.98.211.160/partner-server${fmtUrl}`
   var url=`/partner-server${fmtUrl}`
  
  // let url = `${process.env.BUILD_TYPE == 'pro'? 'http://intermediate.gamehualing.com/': ''}${fmtUrl}` ;
  const options = {
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */

  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    credentials: 'include',
  };

  const newOptions = { ...defaultOptions, ...options };
  let FcToken = storage.get("FcToken")?storage.get("FcToken"):null;
  let path=window.location.hash.slice(1)
  if(path !=='/adlogin' & ! FcToken){
    if(path !=='/login'){
      return router.push('/login')
    }
  }
  if (FcToken) {
    newOptions.headers = {
      'Accept': 'application/json',
      'token': FcToken
    };
  }
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Access-Control-Allow-Origin':'*',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'Access-Control-Allow-Origin':'*',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
    }
  } else {
    newOptions.headers = {
      Accept: 'application/json',
      'Access-Control-Allow-Origin':'*',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
  }
  return fetch(url, newOptions)
  
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .then(res => {
      if (res.code == 200 || res?.success) {
        return res;
      } else {
        message.error(res?.message);
      
      }
      return res;

    })
    .catch(e => {
      window.g_app._store.dispatch({
        type: '/login',
      });
    });
}
