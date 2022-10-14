import request from '@/utils/request';

export async function AccountLogout(params) {
  return request('/system/user/logout', {
    method: 'POST',
    body: params,
  });
}

/* 推广员管理 start------ */
export async function proxyUserList(params) {
  return request('/proxy_user/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 推广员管理 end------ */
