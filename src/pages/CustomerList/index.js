import React,{useEffect, useState}from 'react'
import styles from './index.less'
import { Form,Card, Input, Button,Select,Icon ,notification,Radio,Col, message, Modal} from 'antd';
import { formatMessage } from 'umi/locale';
import { UserList, UserenbOrDis, OperationalRole } from '@/api/account';
import TableList from './TableList';
import { storage ,RoleListType} from '@/utils/utils';
import { userDataList } from '@/api/customer';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { profitInfo, User } from '@/api/User';
const Web3Utils = require("web3-utils");
const BigNumber = require("bignumber.js");
// import { TeamOutlined } from '@ant-design/icons';

export default function Account () {
    // 根据当前账号角色/权限，只能显示自己所属下级角色
   // 弹框
   
   const [visible, setVisible] = useState(false)
   const [usersInfo, setUsersInfo] = useState({
     pageNum: 1,
     pageSize: 10,
     total: 0,
     account:'',
     userType: '', //userType
     userlist:[]  //用户列表
   })

    // 获取用户列表
  const custList = (value) => {
    try {
      return   userDataList(value).then(res => {
        if (res?.success) {
          setUsersInfo({
            ...usersInfo,
            total: res.total,
            pageSize: res.pageSize,
            pageNum:res.pageNum,
            dataList:res.data
          })
        } 
      })
    } catch (err) {
      message.error(err)
   }
  }
    // 修改页数/页码
  const page = (value) => {
    let parpms = {
      pageNum: value.pageNum,
      pageSize: value.pageSize,
      account:usersInfo.account,
      userType: usersInfo.userType, //userType
    }
    custList(parpms)
      }
    // 切换角色
   const RoleChange = e => {
    setUsersInfo({
      ...usersInfo,
      userType: e,
    });
   };
   const { Option } = Select;
  

    const InputChange = e => {
      setUsersInfo({
        ...usersInfo,
        account: e.target.value,
      })
    }
    const  Empty = e => {
      setUsersInfo({
        ...usersInfo,
        account: '', //账号
        userType: '', //userType
      })
    }
  // 搜索
  const handleSubmit = () => {
    // console.log(usersInfo);
    let params = {
      account: usersInfo.account,
      userType: usersInfo.userType,
      pageNum: usersInfo.pageNum,
      pageSize:usersInfo.pageSize
    }
    custList(params)
    
  }

  // 关闭弹框
 const  handleOk = e => {
    setVisible(false);
 };
  const [currRole, setCurrRole] = useState([])
  const [profit,setprofit] = useState({
    totalFcc: 0,
    totaLFcr:0,
    totalMatic:0,
    countryPartner:0,
    cityPartner:0,
    communityPartner:0,
    commonUser:0,
  })
  // 获取本地当前用户角色权限。
  const currentRole = () => {
    let state = storage.get('CurrentRole') ? storage.get('CurrentRole') : null
    if(state){
      setCurrRole(RoleListType(storage.get('CurrentRole')));
    }
  
  }
 const BigNum = (txt, decimal = 2)=> {
    if (isNaN(txt)) return "0";
    if(txt==0) return "0";
    let BN = Web3Utils.BN;
  
    var w = Web3Utils.fromWei(new BN(txt.toString()), "ether");
    var b = new BigNumber(w);
    return b.toFormat(decimal);
  }
  useEffect(() => {
    custList({})  // 获取用户列表
    currentRole() // 
    profitInfo().then(res => {
      if (res) {
        res.data.totalCommission = BigNum(res.data.totalCommission,8)
        res.data.frozenCommission = BigNum(res.data.frozenCommission,8)
        res.data.balanceCommission = BigNum(res.data.balanceCommission,8)
        setprofit(res.data)
      }
    })
   
   
  }, [])
  // 更新数据
  const updataUserInfo = (value) => {
    UserenbOrDis(value).then(res => {
       console.log(value);
    })
  }

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <div className={styles.profit}>
            <div className='profit_1'>
            <div className='profit_title' >
             <img  src={require('../../style/img/profit.png')}  alt='' className='profit_logo'/>
            {formatMessage({ id: 'TotalRevenue' })}</div>
            <div className='profit_info'>
              <div className='fcc'>
                <span>{formatMessage({id:'TotalCommission'})}</span>
                <span className='number'>{profit.totalCommission}</span>
                <span>ETH</span>
              </div>
                  
              <div className='fcc'>
              <span>{formatMessage({id:'FrozenCommission'})}</span>
                <span className='number'>{profit.frozenCommission}</span>
                <span>ETH</span>
              </div>
              <div className='fcc'>
              <span>{formatMessage({id:'BalanceCommission'})}</span>
                <span className='number'>{profit.balanceCommission}</span>
                <span>ETH</span>
              </div>
             
              </div>
            
            </div>
            <div className='profit_1 '>
            <div className='profit_title'>
            {/* <Icon type="team" /> */}
             <Icon type='team'  className='profit_logo'/>
              {formatMessage({ id: 'GeneralPartner' })}</div>
            <div className='profit_info '>
             <div className='_info'>
                <span className='number'>{profit.countryPartner}</span>
                <span>{formatMessage({id:'country_partner'})}</span>
              </div>
              <div className='_info'>
                <span className='number'>{profit.cityPartner}</span>
                <span>{formatMessage({id:'city_partner'})}</span>
              </div>
              <div className='_info'>
                <span className='number'>{profit.communityPartner}</span>
                <span>{formatMessage({id:'community_partner'})}</span>
              </div>
              <div className='_info'>
                <span className='number'>{profit.commonUser}</span>
                <span>{formatMessage({id:'OrdinaryUsers'})}</span>
              </div>
              </div>
              
              </div>
           
        </div>
    <div className={styles.customerList}>
            {/* form  */}
        <Form layout='inline'   >
          <Form.Item label={formatMessage({id:'WalletAddress'})}  >
             <Input placeholder={formatMessage({ id: 'user' })}
              allowClear value={usersInfo.account} onChange={InputChange}/>
            </Form.Item>
            <Form.Item label={formatMessage({id:'Role'})}  >
               <Select  style={{ width: 120 }} defaultValue={''}
            onChange={RoleChange} value={usersInfo.userType} >
            {
             currRole.map(item => {
                 return  <Option key={item.roleId} value={item.roleId2}>{formatMessage({ id: item.roleCode })}</Option>
              })
                }
                 <Option  value={0}>{formatMessage({ id: 'OrdinaryUsers' })}</Option>
               <Option  value={''}>{formatMessage({ id: 'whole' })}</Option>
               </Select>
             </Form.Item>
              <Form.Item  className='submit' >
               <Button type="primary" icon="search"  style={{marginRight:'10px'}} htmlType="submit" onClick={handleSubmit}/>
                <Button   icon="reload"  onClick={Empty}/>
               </Form.Item>
          </Form>          
          {/* 表格 */}
            <TableList  data={usersInfo} page={page} custList={custList} />
           
        </div>
        </Card>
      </PageHeaderWrapper>
  )
}
