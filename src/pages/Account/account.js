import React,{useEffect, useState,useRef}from 'react'
import { Card, message } from 'antd';
import styles from './index.less'
import { Form, Input, Button,Select,Icon ,Modal,Radio,Col} from 'antd';
import { formatMessage } from 'umi/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
 import AccTabList from './accTabList'
import { UserList,UserenbOrDis, OperationalRole, SubmitUserList, SubmitPartner } from '@/api/account';
import AddForm from './addForm';

// import AddForm from './addForm';
export default function account (props) {
    // 根据当前账号角色/权限，只能显示自己所属下级角色
   // 弹框
  const [visible, setVisible] = useState(false)
 
   const [usersInfo, setUsersInfo] = useState({
     pageNum: 1,
     pageSize: 10,
     walletAddress: '', //账号
     roleId: '', //roleId
     status: '',  //状态
     userlist: [], //用户列表
     total:0
   })
   const  roleList = [
      {
        id: 2,
        name:'NationalPartner'
      },
      {
        id: 3,
        name:'CityPartner'
      },
      {
        id: 4,
        name:'CommunityPartners'
      },
      {
        id: 5,
        name:'OrdinaryUsers'
    }
    ]
  
    // 切换角色
   const RoleChange = e => {
    setUsersInfo({
      ...usersInfo,
      roleId: e,
      });
   };
   const { Option } = Select;
  
    // 状态
    const handleChange = e => {
      setUsersInfo({
        ...usersInfo,
        status: e,
      });
    }
    const InputChange = e => {
      setUsersInfo({
        ...usersInfo,
        walletAddress: e.target.value,
      })
    }
    const  Empty = e => {
      setUsersInfo({
        ...usersInfo,
        walletAddress: '', //账号
       roleId: '', //roleId
       status: '',  //状态
      })
      console.log(e);
    }
  // 搜索
  const handleSubmit =async () => {
    const params = {
      pageNum: usersInfo.pageNum,
      pageSize: usersInfo.pageSize,
      status: usersInfo.status,
      walletAddress: usersInfo.walletAddress,
      roleId:usersInfo.roleId
    }
await    SubmitUserList(params).then(res => {
      if (res) {
        setUsersInfo({
          ...usersInfo,
          total:res.total,
          userlist: res.data,
        })
      }
    })
  }
  // 关闭弹框
 const  handleOk = e => {
    setVisible(false);
 };
  // 请求数据
  const useInfoList = (value) => {
    try {
      UserList(value).then(res => {
        if (res?.data) {
          setUsersInfo({
            ...usersInfo,
            total:res.total,
            userlist: res.data,
          })
        }
      })
    } catch (err) {
      message.error(err)
   }
  }
  
  const form = useRef() //添加表单ref
  // 更新数据
  const updataUserInfo = (value) => {
    UserenbOrDis(value).then(res => {
      if(res?.code==200) return message.success(formatMessage({id:'UpdateSucceeded'}))&& useInfoList({
        pageNum: 1,
        pageSize:10
      })
    })
  }
  // 添加用户
  const [adduser, setAddUser] = useState({
    email: '',
    password: '',
    roleId: '',
    inviteCode: '',// 父级邀请码
    parentPercent: 0, //自留
    childrenPercent:0,  //子级
  })

  const [currentRole,setCurrentRole]=useState([])//当前用可以操作的权限id

  useEffect(() => {
    useInfoList({
      pageNum: 1,
      pageSize:10
    })
    OperationalRole().then(res => {
      if (res) {
        setCurrentRole(res.data)
      }
    })
   
    
  }, [])

  // 添加用户输入
  const onChangAdduser = (value) => {
    setAddUser({
      ...adduser,
      ...value,
    })
  }
  // 关闭弹层
  const onClose = async() => {
    setAddUser({
      email: '',
    password: '',
    roleId: -1,
    inviteCode: '',// 父级邀请码
    parentPercent: '', //自留
    childrenPercent:'',  //子级
    })
    setVisible(false)
  }

  const page = (value) => {
    let params = {
      status: usersInfo.status,
      walletAddress: usersInfo.walletAddress,
      roleId: usersInfo.roleId,
      ...value,
    }
    SubmitUserList(params).then(res => {
      if (res) {
        setUsersInfo({
          ...usersInfo,
          ...value,
          total:res.total,
          userlist: res.data,
        })
      }
    })
  }
  //  type add/edit
  const [edit,setEdit]=useState({}) //需要修改的用户信息
  const [type, setType] = useState('add')
  const isModify = async(value, id) => {
    setType(value)
    if (value == 'edit') {
      await   SubmitPartner(id).then((res) => {
          setEdit({
          ...res.data,
          userId:id
           })
       })
     
    }
    setVisible(true)
  }
  return (

    <PageHeaderWrapper>
    {/* 首页内容区域 */}
      <Card bordered={false}>
      <div className={styles.account}>
            {/* form  */}
            <Form layout='vertical'   >
              <Form.Item label={formatMessage({id:'WalletAddress'})}  >
                <Input placeholder={formatMessage({ id: 'user' })}
                 allowClear value={usersInfo.walletAddress} onChange={InputChange}/>
            </Form.Item>
            <Form.Item label={formatMessage({id:'Role'})}  >
           <Select defaultValue={''} style={{ width: 180 }}
               onChange={RoleChange} value={usersInfo.roleId}>
                  {
                    currentRole.map(item => {
                      return <Option  key={item.roleId} value={item.roleId}>{formatMessage({id:item.roleCode})}</Option>
                    })
               }
               <Option  value=''>{formatMessage({id:'whole'})}</Option>
          </Select>
              </Form.Item>
              <Form.Item  className='enable' >
          <Select defaultValue={''} style={{ width: 140 }} onChange={handleChange} value={usersInfo.status}>
          <Option value={1}>{formatMessage({id:'Enable'})}</Option>
          <Option value={0}>{formatMessage({id:'Disable'})}</Option>
          <Option value={''}>{formatMessage({id:'whole'})}</Option>
         </Select>
              </Form.Item>
              <Form.Item  className='submit' >
               <Button type="primary" icon="search"  style={{marginRight:'10px'}} htmlType="submit" onClick={handleSubmit}/>
              <Button   icon="reload"  onClick={Empty}/>
                </Form.Item>
          </Form>
          <Button type="primary" icon='plus-square' style={{ marginBottom: '10px' }} onClick={()=>isModify('add')}>{formatMessage({ id: 'AddUser' })}</Button>
          
          {/* 表格 */}
          <AccTabList isModify={isModify} page={page} usersInfo={usersInfo} updataUserInfo={updataUserInfo}/>

         
        </div>
        <Modal
          visible={visible}
            centered
          footer={null}
          destroyOnClose
            closable={false}
            bodyStyle={{
              padding:'0px'
            }}
          width={500}
          > 
          <div className={styles.modal_title}> {type=='add'?formatMessage({ id: 'AddUser' }):formatMessage({ id: 'ModifyAccount' })}
          <Icon type="close"  className='close' onClick={onClose} />
          </div>

          <AddForm  edit={edit} useInfoList={useInfoList} ref={form} type={type} onClose={onClose} currentRole={currentRole} />
        </Modal>
     </Card>
    </PageHeaderWrapper>
  )
}


