import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Home.less';
import { formatMessage } from 'umi/locale';
import CustomerList from '../CustomerList'
import { profitInfo } from '@/api/User';
import { storage } from '@/utils/utils';
import { OperationalRole } from '@/api/account';
class Home extends PureComponent {
  state = {
    // profit: {
    //   totalFcc:0,
    //   totaLFcr: 0,
    //   totalMatic: 0,
    //   countryPartner: 0,
    //   cityPartner: 0,
    //   communityPartner: 0,
    //   commonUser: 0
    // } //收益
  }
  componentDidMount () {
    // profitInfo().then(res => {
    //   if (res) {
    //     this.setState({
    //       profit:res.data,
    //     })
    //   }
    // })
    OperationalRole().then(res => {
      if (res) {
        // 当前用户可以设置的角色
        storage.set('CurrentRole',res.data)
      }
    })
  }

  render () {
    // const {profit}=this.state
    return (
      <PageHeaderWrapper>
        {/* 首页内容区域 */}
        <Card bordered={false}>
          <div className={styles.home}>
           
             <CustomerList  />
           </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Home;
