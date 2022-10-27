import request from '@/utils/request'
import { paramsPath } from '@/utils/utils'


/**
 * 获取当前用户信息
 * @param {*} params  {token}
 * @returns 
 */
 export const User = () => {
  return   request('/admin/user',{
    method: 'get',
  })
}

/**
 * c查询用户信息
 * @param {*} params  { walletAddress:账号，roleId：角色，status,pageNum,pageSize}
 * @returns 
 */
 export const UserInfo = (params) => {
  return   request('/admin/user/list',{
    method: 'get',
    params
  })
 }
/**
 * 修改密码
 * @param {*} params  
 * @returns 
 */
 export const ChangePassword = (data) => {
  return   request('/admin/user/changePassword',{
    method: 'post',
    body:JSON.stringify({...data})
  })
 }
 /**
  * 查询角色列表
  * @returns 
  */
 export const rolesList = () => {
  return   request('/admin/role/list',{
    method: 'get',
  })
 }

/**
 * 查询客户列表
 * @returns {childrenUserId;}
 */
 export const userCustomerList = (params) => {
  return   request('/partner/user/customerList',{
    method: 'get',
    params
  })
 }

 /**
  * 获取合伙人收益
  * @returns 
  */
 export const profitInfo = () => {
  return   request('/partner/user/sumary',{
    method: 'get',
  })
 }

 /**
  * 添加个人信息
  * @param {*} inviteCode {邀请码}
  * @param {*} data {}
  */
 export const userProfitInfo = (inviteCode,data) => {
  return   request(`/partner/form/saveOrUpdate/`+inviteCode,{
    method: 'post',
    body:JSON.stringify({...data})
  })
 }

 //是否填写表单
 export const checkFormExists = (data) => {
  return   request(`/partner/form/checkFormExists?uid=${data}`,{
    method: 'get',
  })
 }

 /**
  * 获取当前用户填写的信息
  * @returns{}「
  */
 export const FormInfo = () => {
  return   request(`/partner/form`,{
    method: 'get',
  })
 }

 /**
  *  获取用户填写的信息
  * @param {\} data 
  * @returns 
  */
 export const userTypeInfo = (data) => {
  return   request(`/partner/form?uid=${data}`,{
    method: 'get',
  })
 }

/**
 * 解除绑定
 * @param {*} data 
 * @returns 
 */
 export const userRelieve = (data) => {
  return   request(`/partner/user/unBind/${data}`,{
    method: 'put',
  })
 }

//  /partner/user/userInfo
/**
 * 获取个人信息
 * @param {*} data 
 * @returns 
 */
export const SetuserInfo= (data) => {
  return   request(`/partner/user/userInfo?userId=${data}`,{
    method: 'get',
  })
 }
