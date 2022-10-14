import request from '@/utils/request'

/**
 * 登陆
 * @param {*} data 
 * @returns 
 */
export const LoginApi = (data) => {
  return   request('/admin/user/login',{
    method: 'post',
    body: JSON.stringify({...data})
  })
}

export const UserLoginApi = (data) => {
  return   request('/admin/user/partnerLogin',{
    method: 'post',
    body: JSON.stringify({...data})
  })
}




