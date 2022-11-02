import React, { Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon ,Select,Button} from 'antd';
import styles from './UserLayout.less';
// import logo from '../assets/logo.svg';
import { formatMessage,setLocale ,getLocale} from 'umi/locale';

import { isIE } from '@/utils/utils';
import router from 'umi/router';

const copyright = <Fragment />;

@connect(({ login }) => ({
  login,
}))
class UserLayout extends React.PureComponent {
  componentDidMount () {
    setLocale('en-US',false)
  }
   onManual = () => {
    // router.push('/manual/user_manual')
    window.open(`${window.location.origin}#/manual/user_manual`,'_blank')
     
   }
  render () {
    // const handleChange = (value) => {
    //   setLocale(value, false);
    // };
    const { children } = this.props;
    const { Option } = Select;
     
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loginHeader}>
          <div className='user_manual' onClick={this.onManual}>
            <img src={require('../style/img/manual_logo.png')} alt='User manual' className='manual_logo' />
              <span >{formatMessage({id:'UserManual'})}</span>
            </div>
        
           
          {/* <div className='language'>
            <span className='lang'>{formatMessage({id:'navBar.lang'})}</span>
            <Select defaultValue={getLocale()} style={{ width: 120 }} onChange={handleChange}>
             <Option value="en-US">English</Option>
             <Option value="zh-CN">中文</Option>
             <Option value="ar-EG">بالعربية</Option>
              <Option value="vi-VN">ViệtName</Option> 
              <Option value="id-ID">Indonesia</Option>
             <Option value="pl-PL">Pilipino</Option>
             <Option value="ko-KR">한국어 공부 해요.</Option>
           </Select>
            </div> */}
          </div>
          
          <div className={styles.freeCity_logo}>
            <img src={require('../style/img/freecity_logo.png')} alt='free city' />
             {/* <span className='fc_agent'>{formatMessage({id:'FreecityAgent'})}</span> */}
          </div>
          {isIE() ? <h1 style={{ textAlign: 'center' }}>请使用谷歌浏览器访问</h1> : children}
        </div>
        {/* <GlobalFooter copyright={copyright} /> */}
      </div>
    );
  }
}

export default UserLayout;
