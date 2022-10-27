import React, { PureComponent } from 'react';
import { setLocale,formatMessage ,getLocale} from 'umi/locale';
import { Menu, Icon,Dropdown ,Select,Modal,Button,Form,Input,message} from 'antd';
import styles from './index.less';
// import { DownOutlined } from '@ant-design/icons';
import { Link } from 'dva/router';
import { getConfirmLocale } from 'antd/lib/modal/locale';
import router from 'umi/router';
import { isUrl, storage } from '@/utils/utils';
import { goPage } from '@/utils/aublicMethod';
import Manual from '@/pages/ManualPDF';
import { ChangePassword } from '@/api/User';
@Form.create()
export default class GlobalHeaderRight extends PureComponent {
  componentDidMount (props) {
  
  }
  state = {
    visible: false,
    confirmDirty: false,
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        ChangePassword({password:values.password}).then(res => {
          if (res?.success) {
            message.success(formatMessage({id:'ModifiedSuccessfully'}))
            this.setState({
              visible: false,
             });
          }
        })
      }
    });
  };
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  // 添加提示
  hideModal = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
  const { currentUser, onMenuClick, theme,collapsed } = this.props;
    const { Option } = Select;
    const goLogin = async (value) => {
      if (value == '/login') {
        storage.remove('FcToken')
        storage.remove('CurrentRole')
        storage.remove('cutuserInfo')
        storage.remove('CustomerDetails')
        value = storage.get("loginPage")||value
      }
     await router.push(value)
    }
    const changePsw = async ()=>{
      this.setState({
        visible: true,
       });
    }
    const menu = (
      <Menu >
        <Menu.Item key='1' onClick={()=>goLogin('/current_userInfo/userInfo')}>
        <span >
            {formatMessage({ id: 'PersonalInformation' })}
          </span>
       </Menu.Item>
      {storage.get('cutuserInfo')&&storage.get('cutuserInfo').roleId == 1&&<Menu.Item key='3' onClick={()=>changePsw()}>
        <span >
        {formatMessage({ id: 'changePsw' })}
        </span>
       </Menu.Item>} 
     <Menu.Item key='2' onClick={()=> goLogin('/login')}>
     <span >
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
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
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
        <Dropdown overlay={menu}>
         <div  onClick={e => e.preventDefault()} style={{cursor:'pointer'}}>
         { storage.get('cutuserInfo')?storage.get('cutuserInfo').email:''} <Icon type="down" style={{marginLeft:'10px'}}/>
           </div>
       </Dropdown>
       <Modal
          visible={this.state.visible}
         footer={null}
          centered
          destroyOnClose
          width={500}
          bodyStyle={{ textAlign: 'center' }}
          onCancel={this.hideModal}
        >
          <div style={{ margin: '15px' }}>

          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="Password" hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(<Input.Password />)}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(<Input.Password onBlur={this.handleConfirmBlur} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
          {formatMessage({id:'modify'})}
          </Button>
        </Form.Item>
      </Form>
          </div>
        </Modal>
      </div>
    );
  }
}
