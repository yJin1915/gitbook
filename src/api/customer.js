import request from '@/utils/request'
import { paramsPath } from '@/utils/utils'

/**
 *  客户列表
 * @param {*} data 
 * @returns 
 */
export const userDataList = (params) => {
  return   request(`/partner/user/customerList${paramsPath(params)}`,{
    method: 'get',
  })
}


/**
 * 获取详细佣金比例
 * @param {*} params 
 * @returns 
 */
export const userCommissionList = (params) => {
  return   request(`/partner/user/commissionList${paramsPath(params)}`,{
    method: 'get',
  })
}

export const transferList = (params) => {
  return   request(`/partner/transfer/list`,{
    method: 'post',
    body:JSON.stringify({...params})
  })
}