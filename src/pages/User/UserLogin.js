import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage, setLocale, getLocale } from 'umi/locale';
import { Alert, Modal, Button } from 'antd';
import Login from '@/components/UserLogin';
import styles from './UserLogin.less';
import { goPage } from '@/utils/aublicMethod';
import { storage } from '@/utils/utils';
import router from 'umi/router';
import { OperationalRole } from '@/api/account';
import { UserLoginApi } from '@/api/Login';
import Web3 from "web3";


@connect(({ login, menu, loading }) => ({
  login,
  menu,
  submitting: loading.effects['login/login'],
}))
class UserLoginPage extends Component {

  state = {
    autoLogin: true,
    _token: '',
    captcha: '',
    visible: false,
    FromVisible: false
  };

  onGetCaptcha = () => { };

  handleSubmit = () => {
    window.ethereum
    .request({ method: "eth_requestAccounts" })
    .then((accounts) => {
      console.log(accounts)
      if (window.ethereum) {
        let web3 = new Web3(window.ethereum);
        let FreeCity = "123456";
        let invite = "";
        web3.eth.personal
        .sign(web3.utils.fromUtf8(FreeCity), accounts[0], (err, res) => {
          if(err){
            console.log("失败：", err);
            return;
          }
          console.log(res)
           let params = {
            walletAddress: accounts[0],
            signature: res,
            params: FreeCity,
          };
           UserLoginApi(params).then((res) => {
            console.log(res)
          }).catch(err=>{
            console.log(err)
          })
          // router.push('/customer/management/index')
         
        })
        .catch((err) => {
          console.log("失败：", err);
        });
      }
      
      // //一旦获取了用户账号，你就可以签名交易
      // this.initEvent();
      // store.commit("SET_WALLET_CONNECT", true);
      // store.commit("SET_WALLET_ACCOUNT", accounts[0]);
      // if (
      //   localStorage.getItem("addres") != accounts[0] ||
      //   !localStorage.getItem("addres") ||
      //   !localStorage.getItem("token")
      // ) {
      //   localStorage.setItem("token", "");
      // }
      // resolve(accounts);
    })//如果用户拒绝了登录请求
    .catch((reason) => {
      console.log(reason)
      
      // store.commit("SET_WALLET_CONNECT", false);
      // if (reason === "User rejected provider access") {
      //   // 用户不想登录，你看该怎么办？
      //   reject(new Error("用户不想登录，你看该怎么办"));
      // } else {
      //   // 本不该执行到这里，但是真到这里了，说明发生了意外
      //   reject(new Error("说明发生了意外"));
      // }
    });
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
      FromVisible: false
    })
  }
  FormJump = (path) => {
    this.setState({
      FromModal: false
    })
    router.push(path)
  }
  render() {
    const { type, autoLogin, visible } = this.state;
    return (
      <div className={styles.login_land} onClick={this.handleSubmit}>
        <Login
          className={styles.main}
        >
        </Login>
      </div>
    );
  }
}

export default UserLoginPage;
