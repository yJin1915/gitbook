import React, { useEffect, useState } from 'react'
import { Button, Table ,Modal,Descriptions, message} from "antd";
import "antd/dist/antd.css";
import styles from './index.less'
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { storage } from '@/utils/utils';
import { userRelieve, userTypeInfo } from '@/api/User';
const Web3Utils = require("web3-utils");
const BigNumber = require("bignumber.js");
export default function TableList (props) {
  const BigNum = (txt, decimal = 2)=> {
    if (isNaN(txt)) return "0";
    if(!txt||txt==0) return "0";
    let BN = Web3Utils.BN;
  
    var w = Web3Utils.fromWei(new BN(txt.toString()), "ether");
    var b = new BigNumber(w);
    return b.toFormat(decimal);
  }
  const columns = [
    {
      title: formatMessage({id:'SerialNumber'}),
      dataIndex: 'index',
      key:'index',
      width: 100,
      render: (text, record, index) => 	`${(props.data.pageNum - 1) * props.data.pageSize + (index + 1)}`,
      align:'center'
    },
    {
      title: formatMessage({id:'WalletAddress'}),
      dataIndex: "childrenAddress",
      key: "childrenAddress",
      align: 'center',
      render: (text) => (
        text?text:'/'
      )
    },
    {
      title: formatMessage({id:'Role'}),
      dataIndex: "userType",
      key: "userType",
      align: 'center',
      render: (text) => (
       text==0?formatMessage({id:'OrdinaryUsers'}):text==1?formatMessage({id:'community_partner'}):text==2?formatMessage({id:'city_partner'}):text==3?formatMessage({id:'country_partner'}):text==4?'admin':'/'
      )

    },
    {
      title: formatMessage({id:'CreationTime'}),
      dataIndex: "createTime",
      key: "createTime",
      align:'center'

    },
    {
      title: formatMessage({id:'BindParent'}),
      dataIndex: "parentAddress",
      key: "parentAddress",
      align:'center',
      render: (text) => (
         text==''|| text==null ? '/':text
      )
    },
    {
      title:  `${formatMessage({id:'comRate'})}(%)`,
      dataIndex: "commissionPercent",
      key: "commissionPercent",
      align:'center',
      render: (text) => (
        text==''|| text==null ? '/':text+'%'
      )
    },
    {
      title: formatMessage({id:'TotalCommission'}),
      dataIndex: 'totalCommission',
      key:'totalCommission',
      align:'center',
      render: (text, record) => (
        <>
          <div>{BigNum(text,8)}ETH</div>
        </>
      )
    },
    {
      title: formatMessage({id:'FrozenCommission'}),
      dataIndex: 'frozenCommission',
      key:'frozenCommission',
      align:'center',
      render: (text, record) => (
        <>
          <div>{BigNum(text,8)}ETH</div>
        </>
      )
    },
    {
      title: formatMessage({id:'BalanceCommission'}),
      dataIndex: 'balanceCommission',
      key:'balanceCommission',
      align:'center',
      render: (text, record) => (
        <>
          <div>{BigNum(text,8)}ETH</div>
        </>
      )
    },
    {
      title: formatMessage({id:'state'}),
      key:'status',
      render: ( record) => (
        record.status==1?formatMessage({id:'Enable'}):formatMessage({id:'Disable'})
      )
    },
    {
      title: formatMessage({id:'operation'}),
      width: 400,
      key: 'operation',
      align:'center',
      render: (index,record) => {
        return (
          <div style={{color:'pink'}}>
          <Button type="link" onClick={()=>onCustomer(record)}>{formatMessage({id:'CommissionDetails'})}</Button>
          <Button type="link" onClick={()=>onTransfer(record)}>Transfer record</Button>
          <Button  onClick={()=>InfoUser(record)} disabled={record.formExists==1?false:true} type="link" >{formatMessage({id:'ViewFormInfo'})} </Button>
          <Button type="link" disabled={record.hasSuperior !==1?true:false} onClick={()=>relieveVisible(record.childrenUserId)}>{formatMessage({id:"Unbind"})} </Button>
          </div>
        )
      }
    }
  ];
   
  const onChange = (e,pageSize) => {
    props.page({
      pageNum: e,
      pageSize:pageSize
    })
  }
  const onShowSizeChange = (e,pageSize) => {
    props.page({
      pageNum:e,
      pageSize:pageSize
    })
  }

  const onCustomer = (value) => {
    router.push({
      pathname: '/customer/management/index/columnar_details',
    })
    // 存储请求需要的客户佣金数据
    // storage.set('CustomerDetails',{ childrenUserId: value.childrenUserId,
    //   parentUserId: value.parentUserId})
      storage.set('CustomerDetails',{ parentUserId: value.childrenUserId})

  }
  const onTransfer = (value) => {
    router.push({
      pathname: '/customer/management/index/transfer_details',
    })
    // 存储请求需要的客户佣金数据
    storage.set('transferDetails',{ walletAddress: value.childrenAddress})

  }
  
  const [userType, setUserType] = useState(1) //1:城市，2社区，
  const [userForm, setUserForm] = useState({
    partnerName: '',
    phone: '',
    address:'',
    tgId:'',
    twitterId:'',
    knowFreeCity:'',
    projectExperience: '',
    promoteTeam:'',
    promoteWay:'',
    supportNeeded:'',
  })
  const [visible,setvisible]=useState(false) //表单明细弹层

  const InfoUser = (value) => {
    setUserType(value.userType)
    userTypeInfo(value.childrenUserId).then(res => {
      if (res?.success) {
       
        setUserForm({
          ...userForm,
         ... res.data,
        })
        setvisible(true)
      } else {
        message.error(res?.message)
      }
    })
   
  }
  // 
  const handleCancel = () => {
    setvisible(false)
  }
  const [afterVisible, setAfterVisible] = useState(false) //解除弹层
  const [relieve,setRelieve]=useState()
  const afterHideModal = () => {
    setAfterVisible(false)
  }
  // 解除绑定
  const relieveVisible = (value) => {
    setRelieve(value)
    setAfterVisible(true)
  }
  // 
  const onRelieve = () => {
    userRelieve(relieve).then(res => {
      if (res?.success) {
        props.custList({})
        setAfterVisible(false)
        message.success(formatMessage({id:'UnbindSucceeded'}))
      }
    })
  }
  return (
    <div className={styles.table}>
      <Table columns={columns} dataSource={props.data.dataList}
        bordered
        scroll={{ x: 992 }}
        rowKey={(text,record)=>text.childrenUserId}
        tableLayout='auto' columnWidth='200px' defaultSortOrder pagination={
          {
            pageSize: props.data.pageSize,
            current: props.data.pageNum,
            pageSizeOptions: [
              '10','20','30','50'
            ],
            showQuickJumper: true,
            showSizeChanger: true,
            total: props.data.total,
            showQuickJumper:true,
            onChange: onChange,
            onShowSizeChange: onShowSizeChange,
            showTotal: total => `${formatMessage({id:'TotalPages'})}${total}`
           }
         } />
       <Modal
          visible={visible}
        footer={null}
        destroyOnClose
        onCancel={handleCancel}
        width={800}
        >
        <Descriptions title={userType==2?formatMessage({id:'city_partner'}):userType==1?formatMessage({id:'community_partner'}):formatMessage({id:'country_partner'})} bordered column={2}>
        <Descriptions.Item label={formatMessage({id:'name'})}>{userForm.partnerName?userForm.partnerName:'/'}</Descriptions.Item>
        <Descriptions.Item label={formatMessage({id:'Telephone'})}>{userForm.phone?userForm.phone:'/'}</Descriptions.Item>
        <Descriptions.Item label={formatMessage({id:'address'})} span={2}>{userForm.address?userForm.address:'/'}</Descriptions.Item>
        <Descriptions.Item label={formatMessage({id:'DiscordId'})}>{userForm.tgId?userForm.tgId:'/'}</Descriptions.Item>
          <Descriptions.Item label={formatMessage({id:'telegramId'})}>{userForm.twitterId?userForm.twitterId:'/'}</Descriptions.Item>
          {/* 区别 */}
          {
            userType == 2 ||userType == 3? <>
               <Descriptions.Item label={formatMessage({id:'FCview'})}> {userForm.knowFreeCity?userForm.knowFreeCity:'/'}</Descriptions.Item>
        <Descriptions.Item  label={formatMessage({id:'Torture'})} span={2}>{userForm.projectExperience?userForm.projectExperience:'/'}</Descriptions.Item>
        <Descriptions.Item label={formatMessage({id:'PromotionTeam'})} span={2}>{userForm.promoteTeam?userForm.promoteTeam:'/'}</Descriptions.Item>
        <Descriptions.Item label={formatMessage({id:'HowToPromote'})} span={2}>{userForm.promoteWay?userForm.promoteWay:'/'}</Descriptions.Item>
        <Descriptions.Item  label={formatMessage({id:'ProjectSupport'})} span={2}>{userForm.supportNeeded?userForm.supportNeeded:'/'}</Descriptions.Item>
            </> : <Descriptions.Item label={formatMessage({ id: 'HowToPromote' })} span={2}>{userForm.promoteWay ? userForm.promoteWay : '/'}</Descriptions.Item> 
          }
       

        </Descriptions>
      </Modal>
      
      <Modal
          visible={afterVisible}
         footer={null}
          centered
          destroyOnClose
          width={300}
          bodyStyle={{ textAlign: 'center' }}
          onCancel={afterHideModal}
        >
           <div style={{margin:'15px'}}>{formatMessage({id:'AfterUnbinding'})}</div>
            <Button   onClick={afterHideModal} style={{marginRight:'10px'}}>{formatMessage({id:'cancel'})}</Button>
            <Button onClick={onRelieve}>{formatMessage({id:'confirm'})}</Button>
        </Modal>
    </div>
  )
}
