import React, { useEffect, useState } from 'react'
import { Table,Switch, Icon,Modal,Button} from "antd";
import "antd/dist/antd.css";
import styles from './index.less'
import { Link } from 'dva/router';
import { formatMessage } from 'umi/locale';
import FCModal from '@/components/FreeCityModal';

export default function AccTabList (props) {
  const columns = [
    {
      title: formatMessage({id:'SerialNumber'}),
      dataIndex: 'userId',
      key:'userId',
      width: 100,
      render: (text, record, index) => 	`${(props.usersInfo.pageNum - 1) * props.usersInfo.pageSize + (index + 1)}`,
      align:'center'
    },
    {
      title: formatMessage({id:'Account'}),
      dataIndex: "email",
      key: "email",
    },
    {
      title: formatMessage({id:'password'}),
      dataIndex: "password",
      key: "password",
      render: (text,record) => (
       "******"
      )
    },
    {
      title: formatMessage({id:'Role'}),
      dataIndex: "roleId",
      key: "roleId",
      render: (text, record) => (
        text==2?formatMessage({id:'country_partner'}):text==3?formatMessage({id:'city_partner'}):text==4?formatMessage({id:'community_partner'}):text===null||text===''?formatMessage({id:'unknown'}):''
      )
    },
    {
      title: formatMessage({id:'CreationTime'}),
      dataIndex: "createTime",
      key: "createTime"
    },
    {
      title: formatMessage({id:'UpdateTime'}),
      dataIndex: "updateTime",
      key: "updateTime"
    },
    {
      title: formatMessage({id:'commission'}),
      dataIndex: "commissionRate",
      key: "commissionRate",
      render:(text)=>(text?text+'%':'/')
    },
    {
      title: formatMessage({id:'state'}),
      width: '10%',
      key:'status1',
      render: ( record) => (
        record.status==1?formatMessage({id:'Enable'}):formatMessage({id:'Disable'})
      )
    },
    {
      title: formatMessage({id:'operation'}),
      width: 200,
      dataIndex: "status",
      key:'status',
      render: (text, record) => (
        <>
           <Switch
        checkedChildren={<Icon type="check" />}
        
       unCheckedChildren={<Icon type="close" />}
       checked={text - 0 === 1}
            onChange={(checked) => onSwitch(record, checked)} /> 
          <Button  onClick={()=>onModify(record.userId)}  type='primary' size='small' style={{marginLeft:'10px'}}>{formatMessage({id:'modify'})}</Button>
        </>
      )
    }
  ];
  const { usersInfo, updataUserInfo } = props //{}
  const [visible, setvisible] = useState(false)
  const [DisableOrEnable, setDisableOrEnable] = useState('') //启用or 禁用
  const [userId,setUserId]=useState({}) //需要修改用户的信息
  const onSwitch = (index,checked) => {
    if (checked) {
      setDisableOrEnable('AccountIsEnabled')
    } else {
      setDisableOrEnable('Deactivated')
    }
    setvisible(true)
    setUserId({
      userId:index.userId,
      status:checked?1:0
    })
  }
  const onChange = (e,pageSize) => {
    props.page({
      pageNum: e,
      pageSize:pageSize
    })
    
  }
  const onModify = (userId) => {
     props.isModify('edit',userId) //显示弹框
  }
  const onShowSizeChange = (e, pageSize) => {
    props.page({
      pageNum:e,
      pageSize:pageSize
    })
  }

 const  hideModal = () => {
    setvisible(false)
 };
   // 修改状态/启用or停用
  const DisOrend = () => {
    console.log(userId);
    updataUserInfo(userId)
    setvisible(false)
  }
 
  return (

    <div className={styles.table}>
      <Table columns={columns} dataSource={props.usersInfo.userlist}
        tableLayout='auto' columnWidth='200px' defaultSortOrder pagination={
          {
            pageSize: usersInfo.pageSize,
            // current: 1,
            defaultCurrent: usersInfo.pageNum,
            pageSizeOptions: [
              '10','20','30','50'
            ],
            showQuickJumper: true,
            showSizeChanger: true,
            total: usersInfo.total,
            showQuickJumper:true,
            onChange: onChange,
            onShowSizeChange: onShowSizeChange,
            showTotal: total => `${formatMessage({id:'TotalPages'})}${total}`
           }
         } />
      <FCModal  visible={visible}  texts={DisableOrEnable} hideModal={hideModal} DisOrend={DisOrend}/>
    </div>
  )
}

