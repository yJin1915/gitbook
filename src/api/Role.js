import request from '@/utils/request'
import { paramsPath } from '@/utils/utils'


/**
 * 获取当前用户侧边栏权限
 * @param {*} params  {type:
 * 1 目录
  2 菜单
  3 按钮/接口}
 * @returns 
 */
export const UserRole = (data) => {
  return   request('/admin/permission/user?type='+`${data}`,{
    method: 'get',
  })
}
// /admin/role

/**
 * 修改角色名字{}
 * @param {*} data 
 * @returns 
 */
export const EditRoleName = (data) => {
  return   request(`/admin/role`,{
    method: 'put',
    body:JSON.stringify({...data})
  })
}