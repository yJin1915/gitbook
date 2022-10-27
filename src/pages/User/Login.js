import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { formatMessage, FormattedMessage,setLocale ,getLocale } from 'umi/locale';
import {  Alert, Modal ,Button,message} from 'antd';
import Login from '@/components/Login';
import UserLogin from '@/components/UserLogin';
import styles from './Login.less';
import { goPage } from '@/utils/aublicMethod';
import { storage } from '@/utils/utils';
import {LoginApi,UserLoginApi} from '@/api/Login'
import router from 'umi/router';
import {  OperationalRole } from '@/api/account';
import { SetuserInfo, User } from '@/api/User';
const Web3EthPersonal = require('web3-eth-personal');
const Web3Utils = require("web3-utils");

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, menu, loading }) => ({
  login,
  menu,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    autoLogin: true,
    _token: '',
    captcha: '',
    visible: false,
    FromVisible:false
  };

  onGetCaptcha = () => {};
 
  handleSubmit =async (err, values) => {
    const { username, password } = values;
    const {
      dispatch,
      menu,
      route: { routes },
    } = this.props;
    if (!username ||!password) return
    else {
       await LoginApi({
        email: username,
        password:password
      }).then((res) => {
        // console.log(res.data.token);
        if (res?.success) {
          storage.set('FcToken', res.data.token)
          OperationalRole().then(res1 => {
            if (res1?.success) {
               //获取当前用户信息
              
              storage.set('CurrentRole', res1.data)
              return   User()  
             }
          }).then(res=> {
            if (res?.success) {
              storage.set('cutuserInfo', { ...res.data.user, ...res.data.role })
              // if(res.data.user.formStatus-0 !==1 && res.data.user)
              // 获取用户信息是已填写表单
             return SetuserInfo(res.data.user.userId)
              }
          }).then(res => {
            if (res?.success) {
              if (res.data.formStatus - 0 !== 1 && storage.get('cutuserInfo').roleId !== 1 && storage.get('cutuserInfo').roleId !== 2) {
                this.setState({
                  FromVisible:true
                 })
               }else {
                router.push('/customer/management/index')
               }
              } 
            })
          
        }
       
       
    })
     }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

   showModal = () => {
     this.setState({
        visible: true,
     })
  };

   hideModal = () => {
    this.setState({
      visible: false,
   })
   };
  // 跳转外部链接
   Jump = (path) => {
     goPage(path);
     this.setState({
      visible: false,
   })
  }
  // 去填写表单的弹框
  FromModal = () => {
    this.setState({
      FromVisible:false
    })
  }
  FormJump = (path) => {
    this.setState({
      FromModal:false
    })
    router.push(path)
  }
  handleSubmit1 = () => {
    if(!window.ethereum){
      window.open("https://metamask.io/download.html","_blank")
      return;
    }
    window.ethereum
    .request({ method: "eth_requestAccounts" })
    .then((accounts) => {

      let chainId = web3.currentProvider.chainId
      if(chainId!="0x1"){//如果不是以太坊主网
        message.error(formatMessage({id:'Mainnet'}));
        //TODO
        return;
      }
      if (window.ethereum) {
        let web3 = new Web3EthPersonal(window.ethereum);
        let FreeCity = "123456";
        let invite = "";
        web3.sign(Web3Utils.fromUtf8(FreeCity), accounts[0], (err, res) => {
          if(err){
            console.log("失败：", err);
            return;
          }
           let params = {
            walletAddress: accounts[0],
            signature: res,
            params: FreeCity,
          };
           UserLoginApi(params).then((res) => {
            if (res?.success) {
              storage.set('FcToken', res.data.token)
              User().then(res=> {
                if (res?.success) {
                  storage.set('cutuserInfo', { ...res.data.user, ...res.data.role })
                  // if(res.data.user.formStatus-0 !==1 && res.data.user)
                  // 获取用户信息是已填写表单
                 return SetuserInfo(res.data.user.userId)
                  }
              }).then(res => {
                if (res?.success) {
                  router.push('/customer/management/index')
                  } 
                })
              
            }
          }).catch(err=>{
            console.log(err)
          })
         
        })
        .catch((err) => {
          console.log("失败：", err);
        });
      }
      
    })//如果用户拒绝了登录请求
    .catch((reason) => {
      console.log(reason)
    });
  };

  render() {
    const { login, submitting,location } = this.props;
    const { type, autoLogin,visible } = this.state;
   if(window.location.host.indexOf("adminbox.")>-1||location.pathname=='/adlogin'){
    storage.set("loginPage","/adlogin")
    return (
      <div className={styles.login_land}>
        <div className='user_login'>
          {formatMessage({id:'Userlogin'})}
        </div>
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          {login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            this.renderMessage(formatMessage({ id: 'message-invalid-credentials' }))}
          <UserName
            name="username"
            placeholder={`${formatMessage({ id: 'Pleaseuser' })}`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'Pleaseuser' }),
              },
            ]}
          />
          <Password
            name="password"
            placeholder={`${formatMessage({ id: 'password' })}`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'Passwordempty' }),
              },
            ]}
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
         
           <div  onClick={this.showModal} className='forgot'>
              <FormattedMessage id="forgot-password" />
            </div>
            <Submit loading={submitting} style={{ background: 'linear-gradient(to right, #e1aeff, #8dffff)',border:'none'}} >
            <FormattedMessage id="login" />
          </Submit>
          
        </Login>
        <Modal
        title={formatMessage({id:'platformhandling'})}
        visible={visible}
        onOk={this.hideModal}
          onCancel={this.hideModal}
          footer={null}
          destroyOnClose={true}
          centered={true}
          style={{ textAlign: 'center',borderRadius: '10px' }}
      >
          <div style={{ marginBottom: '20px' }}>
            <Button style={{width:'200px'}} onClick={()=>this.Jump('https://t.me/FreeCity02')}>{formatMessage({ id: 'telegram' })}</Button></div>
         <div> <Button style={{width:'200px'}}  onClick={()=>this.Jump('https://discord.gg/freecityofficial ')}>{formatMessage({id:'Discord'})}</Button></div>
        </Modal>
        
        {/* 去填写表单 */}
        <Modal
        visible={this.state.FromVisible}
          onCancel={this.FromModal}
          footer={null}
          destroyOnClose={true}
          centered={true}
          width={300}
          style={{ textAlign: 'center',borderRadius: '10px' }}
        >
          <div style={{marginBottom:'20px'}}>{formatMessage({id:'infoImmediately'})}</div>
          <div >
            <Button style={{marginRight:'10px'}}  onClick={()=>this.FormJump('/customer/management/index')}>{formatMessage({ id: 'talkLater' })}</Button>
         <Button type="primary" onClick={()=>this.FormJump('/current_userInfo/userInfo')}>{formatMessage({id:'ToFillIn'})}</Button></div>
        </Modal>
        </div>
       </div>
    );
    }else{
      storage.set("loginPage","/login")
      return (
        <div className={styles.login_land1} onClick={this.handleSubmit1}>
          <UserLogin className={styles.main1}>
          </UserLogin>
        </div>
      );
    }
  }
}

export default LoginPage;
