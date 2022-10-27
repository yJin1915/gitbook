import React, { useEffect, useState } from 'react'
import { Card, Table } from 'antd';
import { formatMessage } from 'umi/locale';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import router from 'umi/router';
import { transferList } from '@/api/customer';
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
      dataIndex: 'index',
      key: 'index',
      align:'center',
      render: (text, record, index) => 	`${(detailed.pageNum - 1) * detailed.pageSize + (index + 1)}`,
    },
    {
      title: formatMessage({id:'transactionHash'}),
      dataIndex: 'transactionHash',
      key: 'transactionHash',
      align:'center',
    },
    {
      title: formatMessage({id:'blockNumber'}),
      dataIndex: 'blockNumber',
      key: 'blockNumber',
      align:'center',
    },
    {
      title: formatMessage({id:'gasUsed'}),
      dataIndex: 'gasUsed',
      key: 'gasUsed',
      align:'center',
    },
    {
      title: formatMessage({id:'contractAddress'}),
      dataIndex: 'contractAddress',
      key: 'contractAddress',
      align:'center',
    },
    {
      title: formatMessage({id:'status'}),
      dataIndex: 'status',
      key: 'status',
      align:'center',
    },
    {
      title: formatMessage({id:'fromAddress'}),
      dataIndex: 'fromAddress',
      key: 'fromAddress',
      align:'center',
    },
    {
      title: formatMessage({id:'toAddress'}),
      dataIndex: 'toAddress',
      key: 'toAddress',
      align:'center',
    },
    {
      title: formatMessage({id:'sendValue'}),
      dataIndex: 'sendValue',
      key: 'sendValue',
      align:'center',
      render: (text) => (
        <>
          <div>{BigNum(text,8)}ETH</div>
        </>
      )
    },
    {
      title: formatMessage({id:'createTime'}),
      dataIndex: 'createTime',
      key: 'createTime',
      align:'center',
    },
  ];
  let page = {
    pageSize: 10,
    pageNum: 1,
  };
  const onChange = (e,page) => {
    page.pageNum = e
    detailedList({pageNum:e,pageSize:page.pageSize,...storage.get('transferDetails')})
  }
  const onShowSizeChange =async (e,page) => {
    page = {
      pageSize: page,
      pageNum: 1,
    };
    detailedList({pageNum:1,pageSize:page.pageSize,...storage.get('transferDetails')})
  }
 
  // 获取详情请求
  const detailedList = (value) => {
    transferList(value).then(res => {
      if (res?.success) {
        setDetailed({
          pageSize: value.pageSize,
          pageNum: value.pageNum,
          total:res.total,
          data:res.data
        })
       }
    })
  }
  // 存储数据
  const [detailed,setDetailed] = useState({
    pageSize: 10,
    pageNum: 1,
    total: 0,
    data:[]
  })
  useEffect(() => {
    const params=storage.get('transferDetails')?storage.get('transferDetails'):null
    if (params) {
      let data = Object.assign({},params,page)
      transferList(data).then(res => {
        if (res?.success) {
          setDetailed({
            pageSize: page.pageSize,
            pageNum: page.pageNum,
            total:res.total,
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
