import request from '@/utils/request'

export const GetCommission = () => {
  return   request('/admin/set/adminCommissionSet',{
    method: 'post',
  })
}

export const SetCommission= (data) => {
  return   request(`/admin/set/update`,{
    method: 'post',
    body: JSON.stringify({...data})
  })
 }
