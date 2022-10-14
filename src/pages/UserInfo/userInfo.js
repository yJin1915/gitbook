import React, { useEffect,useState } from 'react';
import { Card ,Form, Input, Descriptions,Button, } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage, FormattedMessage } from 'umi/locale';
import styles from './styles.less'
import { storage } from '@/utils/utils';
import FromInfo from '../CustomerList/FromInfo';
import { SetuserInfo, userTypeInfo } from '@/api/User';

const userInfo = () => {
  
  const [user,setUser]=useState({})
  useEffect(() => {
    SetuserInfo(storage.get('cutuserInfo').userId).then(res => {
      setUser(res?.data)
    })
  
  },[])

  const handleSearch = e => {
    e.preventDefault();
    // this.props.form.validateFields((err, values) => {
    //   console.log('Received values of form: ', values);
    // });
  };
  const { TextArea } = Input;
  return (
    <PageHeaderWrapper>
    {/* 首页内容区域 */}
      <Card bordered={false}>
        <Descriptions column={1} title={formatMessage({ id: 'PersonalInformation' })} className={styles. userInfo}>
          <Descriptions.Item label={formatMessage({ id: 'Account' })}  >
            <span >{ user?.email? user.email:'/'}</span>
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'identity' })}  >
            <span >{ user?.roleCode?formatMessage({id: user.roleCode}):'/'}</span>
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'comRate' })}  >
            <span >{ user?.userId !==1 && user.commissionPercent!==null ?  user.commissionPercent+'%':'/'}</span>
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'superior' })}  >
            <span >{ user?.userId==1?'/': user?.parentEmail}</span>
          </Descriptions.Item>
          <Descriptions.Item label={formatMessage({ id: 'MyCode' })}  >
            <span >{ user?.inviteCode? user.inviteCode:'/'}</span>
          </Descriptions.Item>
          {
             user?.userId===1?'':( <Descriptions.Item label={formatMessage({ id: 'Account' })}  >
            <span >{formatMessage({ id: 'Userlogin' })}</span>
          </Descriptions.Item>)
         }
        </Descriptions>
        {/* from表单 */}
        {
           storage.get('cutuserInfo').roleId == 1 ? '' : storage.get('cutuserInfo').roleId == 2 ? '':<FromInfo  />
        }
    
    </Card>
   </PageHeaderWrapper>
  )
}

export default  userInfo;
