import React, { PureComponent, useEffect, useState } from 'react';
import { Card ,Table,Button, Modal,Icon, Form, Input, Col, message} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage, FormattedMessage } from 'umi/locale';
// import { rolesList } from '@/api/User';
import styles from './Commission.less'
// import { EditRoleName } from '@/api/Role';
import router from 'umi/router';

class CommissionPage extends React.Component {

  render() {
    const onFinish = (values) => {
      console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
    return (
      <PageHeaderWrapper>
      返佣结算周期 天
      转账最低金额
      钱包地址 私钥
      <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>


      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
      </PageHeaderWrapper>
    );
  }
}
export default CommissionPage;




