import request from '@/utils/request'
import { paramsPath } from '@/utils/utils'


/**
 * 获取用户列表
 * @param {*} params  {}
 * @returns 
 */
export const UserList = (params) => {
  return   request('/admin/user/list',{
    method: 'get',
    params
  })
}

export const SubmitUserList = (params) => {
  return request(`/admin/user/list${paramsPath(params)}`)
}
  // /admin/user/partner/{userId}
  /**
   * 查询账户「
   * @param {*} params 
   * @returns 
   */
  export const SubmitPartner= (id) => {
    return request(`/admin/user/partner/${id}`)
  }
/**
 * 启用/禁用用户
 * @param {*} data 
 * @returns 
 */
export const UserenbOrDis = (data) => {
  return   request(`/admin/user/enableOrDisable`,{
    method: 'post',
    body:JSON.stringify({...data})
  })
}

/**
 * 当前用户可以add/edit的角色
 * @param {*}  {}
 * @returns 
 */
export const OperationalRole = () => {
  return   request(`/partner/relation/roles`,{
    method: 'get',
  })
}

/**
 * 获取佣金比例
 * @param {*} data 
 * @returns 
 */
export const GetScale = (data) => {
  return   request(`/partner/relation/percent${paramsPath(data)}`,{
    method: 'get',
  })
}

// 添加账户
export const userAdd = (data) => {
  return   request(`/admin/user/add`,{
    method: 'post',
    body:JSON.stringify({...data})
  })
}

// /admin/user/update

// 更改信息
export const userUpData = (data) => {
  return   request(`/admin/user/update`,{
    method: 'put',
    body:JSON.stringify({...data})

  })
}

// /admin/user/email/

/**
 * 查询邮箱
 * @param {*} data {cdeo:}
 */
export const setEmail = (data) => {
  return   request(`/admin/user/email/${data}`,{
  })
}

