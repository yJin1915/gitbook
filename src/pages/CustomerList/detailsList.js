import React, { useEffect, useState } from 'react'
import { Card, Table } from 'antd';
import { formatMessage } from 'umi/locale';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { userCommissionList, userDataList } from '@/api/customer';
import { storage } from '@/utils/utils';
const Web3Utils = require("web3-utils");
const BigNumber = require("bignumber.js");
export default function detailsList (props) {
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
      dataIndex: 'id',
      key: 'id',
      align:'center',
      // render: (text, record, index) => 	`${(detailed.pageNum - 1) * detailed.pageSize + (index + 1)}`,
    },
    // {
    //   title: "partnerAddress",
    //   dataIndex: 'partnerAddress',
    //   key: 'partnerAddress',
    //   align:'center',
    // },
    
    // {
    //   title: "childrenAddress",
    //   dataIndex: 'childrenAddress',
    //   key: 'childrenAddress',
    //   align:'center',
    // },
    {
      title: formatMessage({ id: 'Account' }),
      dataIndex: 'childrenAddress',
      key: 'childrenAddress',
      align:'center',
    },
    {
      title: formatMessage({id:'scene'}),
      dataIndex: 'dcDesc',
      key: 'dcDesc',
      align: 'center',
      render:(text)=>(text?text:'/')
    },
    {
      title: formatMessage({id:'Tradingtime'}),
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      render:(text)=>(text?text:'/')
    },
    {
      title: formatMessage({id:'ConsumptionAmount'}),
      dataIndex: 'dcChanges',
      key: 'dcChanges',
      align: 'center',
      // render: (text, record) => (
      //    record.dcType==1?text+'FCC':record.dcType==2?text+'FCR':record.dcType==3?text+'ETH':''
      // )
      render: (text) => (
        <>
          <div>{BigNum(text,8)}ETH</div>
        </>
      )
    },
    {
      title: formatMessage({id:'RebateRatio'}),
      dataIndex: 'commissionPercent',
      key: 'commissionPercent',
      align: 'center',
      render:(text)=>(text+'%')
    },
    {
      title: formatMessage({id:'commission'}),
      dataIndex: 'commission',
      key: 'commission',
      align: 'center',
      render: (text) => (
        <>
          <div>{BigNum(text,8)}ETH</div>
        </>
      )
    },
    {
      title: formatMessage({id:'directBinding'}),
      dataIndex: 'directBinding',
      key: 'directBinding',
      align: 'center',
      render: (text, record) => (
        record.directBinding==0?'yes':"no"
     )
    },
    {
      title: formatMessage({id:'userType'}),
      dataIndex: 'userType',
      key: 'userType',
      align: 'center',
      render: (text, record) => (
        record.userType==0?formatMessage({id:'OrdinaryUsers'}):record.userType==1?formatMessage({id:'community_partner'}):record.userType==2?formatMessage({id:'city_partner'}):formatMessage({id:'country_partner'})
     )
    },
  ];

  const onChange = (e,page) => {
    detailedList({ pageNum:e,pageSize:page,...storage.get('CustomerDetails')})

  }
  const onShowSizeChange =async (e,page) => {
    // if (page >= detailed.total) return
    //  else {
      // await   setDetailed({
      //   ...detailed,
      //   pageNum:e,
      //   pageSize:page
      // })
      detailedList({ pageNum:e,pageSize:page,...storage.get('CustomerDetails')})
    // }
   
  }
  // 获取详情请求
  const detailedList = (value) => {
    userCommissionList(value).then(res => {
      if (res?.success) {
        setDetailed({
          total:res.total,
          pageSize: res.pageSize,
          pageNum: res.pageNum,
          data:res.data
        })
       }
    })
  }
  // 存储数据
  const [detailed,setDetailed] = useState({
    total: 0,
    pageSize: 10,
    pageNum: 1,
    data:[]
  })
  useEffect(() => {
    const params=storage.get('CustomerDetails')?storage.get('CustomerDetails'):null
    if (params) {
      userCommissionList(params).then(res => {
        if (res?.success) {
          setDetailed({
            pageNum: res.pageNum,
            pageSize: res.pageSize,
            total: res.total,
            data:res.data
          })
        }
      })
    } else {
      router.push('/customer/management/index')
    }
  },[])
  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Table dataSource={detailed.data}
            rowKey={(text,record)=>text.id}
            scroll={{ x: 992 }}
           columns={columns} pagination={
          {
            pageSize: detailed.pageSize,
            // current: 1,
            defaultCurrent: detailed.pageNum,
            pageSizeOptions: [
              '2','10', '20', '30', '50'
            ],
            showQuickJumper: true,
            showSizeChanger: true,
            total: detailed.total,
            showQuickJumper: true,
            onChange: onChange,
            onShowSizeChange: onShowSizeChange,
            showTotal: total => `${formatMessage({id:'TotalPages'})}${total}`
          }} />
      </Card>
   </PageHeaderWrapper>
  )
}
