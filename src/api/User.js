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
 * @param {*} params  { emailLike:账号，roleId：角色，status,pageNum,pageSize}
 * @returns 
 */
 export const UserInfo = (params) => {
  return   request('/admin/user/list',{
    method: 'get',
    params
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
 export const userProfitInfo = (data) => {
  return   request(`/partner/form/saveOrUpdate`,{
    method: 'post',
    body:JSON.stringify({...data})
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
