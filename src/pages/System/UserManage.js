import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect(({ usermanage, loading, role }) => ({
  usermanage,
  role,
  loading: loading.models.usermanage,
}))
@Form.create()
class UserManage extends PureComponent {
  render() {
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>用户列表</Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserManage;
