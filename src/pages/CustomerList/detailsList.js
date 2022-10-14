import React, { useEffect, useState } from 'react'
import { Card, Table } from 'antd';
import { formatMessage } from 'umi/locale';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { userCommissionList, userDataList } from '@/api/customer';
import { storage } from '@/utils/utils';
export default function detailsList (props) {
  
  const columns = [
    {
      title: formatMessage({id:'SerialNumber'}),
      dataIndex: 'index',
      key: 'index',
      align:'center',
      render: (text, record, index) => 	`${(detailed.pageNum - 1) * detailed.pageSize + (index + 1)}`,
    },
    {
      title: formatMessage({id:'Account'}),
      dataIndex: 'account',
      key: 'account',
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
      render: (text, record) => (
         record.dcType==1?text+'FCC':record.dcType==2?text+'FCR':record.dcType==3?text+'MATIC':''
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
      render: (text, record) => (
        record.dcType==1?text+'FCC':record.dcType==2?text+'FCR':record.dcType==3?text+'MATIC':''
     )
    },
  ];

  const onChange = (e) => {
    console.log(e,page, '分页onChange');
    detailedList({ pageNum:e,...storage.get('CustomerDetails')})

  }
  const onShowSizeChange =async (e,page) => {
    if (page >= detailed.total) return
     else {
      await   setDetailed({
        ...detailed,
        pageSize:page
      })
    }
   
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
           columns={columns} pagination={
          {
            pageSize: detailed.pageSize,
            // current: 1,
            defaultCurrent: detailed.pageNum,
            pageSizeOptions: [
              '10', '20', '30', '50'
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
