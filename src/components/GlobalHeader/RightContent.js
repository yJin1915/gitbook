import React, { PureComponent } from 'react';
import { setLocale,formatMessage ,getLocale} from 'umi/locale';
import { Menu, Icon,Dropdown ,Select} from 'antd';
import styles from './index.less';
// import { DownOutlined } from '@ant-design/icons';
import { Link } from 'dva/router';
import { getConfirmLocale } from 'antd/lib/modal/locale';
import router from 'umi/router';
import { isUrl, storage } from '@/utils/utils';
import { goPage } from '@/utils/aublicMethod';
import Manual from '@/pages/ManualPDF';
export default class GlobalHeaderRight extends PureComponent {
  componentDidMount (props) {
  
  }
  
  render() {
  const { currentUser, onMenuClick, theme,collapsed } = this.props;
    const { Option } = Select;
    const goLogin = async (value) => {
      if (value == '/login') {
        storage.remove('FcToken')
        storage.remove('CurrentRole')
        storage.remove('cutuserInfo')
        storage.remove('CustomerDetails')
      }
     await router.push(value)
    }
    const menu = (
      <Menu >
        <Menu.Item key='1'>
        <span onClick={()=>goLogin('/current_userInfo/userInfo')}>
            {formatMessage({ id: 'PersonalInformation' })}
          </span>
       </Menu.Item>
     <Menu.Item key='2'>
     <span onClick={()=> goLogin('/login')}>
        {formatMessage({ id: 'Exitlogin' })}
     </span>
    </Menu.Item>
  </Menu>
    )
      
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
   const  handleChange = (value) => {
     setLocale(value, true);
     
   }

    const onManual = () => {
      // router.push('/manual/user_manual')
      // goPage('/manual/user_manual')
    window.open(`${window.location.origin}#/manual/user_manual`,'_blank')
      // console.log(window.location);
    }
    return (
      <div className={className}>
        {/* 头部导航 */}
        <div className='user_manual' onClick={onManual}>
          <img src={require('../../style/img/manual_logo.png')} alt='User manual' className='manual_logo' />
          <span >{formatMessage({id:'UserManual'})}</span>
         </div>
        {/* <div className='locale'>
          <span className='lang'>{formatMessage({ id: 'navBar.lang' })}</span>
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
        <Dropdown overlay={menu} >
         <div  onClick={e => e.preventDefault()} style={{cursor:'pointer'}}>
         { storage.get('cutuserInfo')?storage.get('cutuserInfo').email:''} <Icon type="down" style={{marginLeft:'10px'}}/>
           </div>
       </Dropdown>
      </div>
    );
  }
}
