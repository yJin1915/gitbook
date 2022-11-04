import moment from 'moment';

export function fixedZero (val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function isUrl (path) {
  const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}

export const getFileName = url => {
  const i = url.lastIndexOf('/');
  return url.substring(i + 1);
};

export const isIE = () => {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE || isIE11 || isEdge) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp['$1']);
    return true;
  } else {
    return false; //不是ie浏览器
  }
};

/**
 *  验证是否为json字符串
 */
export const isJsonString = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * 判断是否为空对象
 * @param obj
 * @returns {boolean}
 */
export const isEmptyObject = function (obj) {
  for (const key in obj) {
    return false;
  }
  return true;
};

/**
 *  过去n天
 *  @param dayNum: 过去天数 0为当天
 *  @param isMoment:是否为moment对象
 */
export const lastNDay = (dayNum = 0, isMoment = false) => {
  const formatDayMs = dayNum * 1 * 60 * 60 * 24 * 1000; // 传入天数的毫秒数
  const momentDay = moment(new Date().getTime() - formatDayMs).set({
    hour: '00',
    minute: '00',
    second: '00',
  });
  return isMoment ? momentDay : momentDay.format('YYYY-MM-DD');
};

/**
 * 防抖动函数
 */
export const debounce = (fn) => {
  var timer;
  return function () {
    var _this = this;
    var args = arguments;
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(_this);
    }, 1000);
  };
};

/**
 * 深复制
 */
export function deepClone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 截取url最后路由值
 */
export const getLastRouteName = url => {
  const index = url.lastIndexOf('/');
  const sliceRouteStr = url.substring(index + 1, url.length);
  return sliceRouteStr.indexOf('?') > -1 ? sliceRouteStr.split('?')[0] : sliceRouteStr;
};

/**获取hash 路由url中的参数**/
export function getQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var t = window.location.hash.split('?');
  var r = t[1] ? t[1].match(reg) : null;
  if (r != null) {
    return decodeURIComponent(r[2]);
  } else {
    return null;
  }
}

/**
 * 是否为数组
 * @param {any} val
 */
export function isArray (val) {
  return Object.prototype.toString.call(val) === '[object Array]';
}

/**
 * 是否为字符串
 * @param {any} val
 */
export function isString (val) {
  return Object.prototype.toString.call(val) === '[object String]';
}

/**
 * 是否为函数
 * @param {any} val
 */
export function isFunction (val) {
  return Object.prototype.toString.call(val) === '[object Function]';
}

/**
 * 是否为对象
 * @param {any} val
 */
export function isObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 根据对象属性值查找索引值
 */
export const findIndexWithAttr = (array, attr, value) => {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
};

//封装操作localStorage本地储存的方法

export const storage = {

  set (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get (key) {
    return JSON.parse(localStorage.getItem(key));
  },
  remove (key) {
    localStorage.removeItem(key);
  }

}
/**
         *  js中字符串超长作固定长度加省略号（...）处理
         * @param str 需要进行处理的字符串，可含汉字
         * @param len 需要显示多少个汉字，两个英文字母相当于一个汉字
         * @returns {string}
         */
export const beautySub = (str, len) => {
  var reg = /[\u4e00-\u9fa5]/g,    //专业匹配中文
    slice = str.substring(0, len),
    chineseCharNum = (~~(slice.match(reg) && slice.match(reg).length)),
    realen = slice.length * 2 - chineseCharNum;
  return str.substr(0, realen) + (realen < str.length ? "..." : "");
}


export const paramsPath = (obj) => {
  let result = '';
  let item;
  for (item in obj) {
    if (obj[item] || obj[item] === 0) {
      result += `&${item}=${obj[item]}`;
    }
  }
  if (result) {
    result = '?' + result.slice(1);
  }
  return result;
}

//  筛选客户角色权限列表
export const RoleListType = (type) => {
  const user = [
    { roleId: 2, roleCode: "country_partner", name: "国家合伙人", roleId2: 3 },
    { roleId: 3, roleCode: "city_partner", name: "城市合伙人", roleId2: 2 },
    { roleId: 4, roleCode: "community_partner", name: "社区合伙人", roleId2: 1 },
    { roleId: 5, roleCode: "TaiWan", name: "台湾合伙人", roleId2: 5 }
  ]
  return type.map(item => {
    return user.find(item1 => item1.roleCode == item.roleCode)
  })
}
