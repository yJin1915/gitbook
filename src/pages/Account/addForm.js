import { GetScale, OperationalRole, setEmail, userAdd, userUpData } from '@/api/account';
import { debounce, storage } from '@/utils/utils';
import { Form, Spin, Input, Button,Radio ,Icon,Modal, message} from 'antd';
import { formatMessage } from 'umi/locale';
// import { LoadingOutlined } from '@ant-design/icons';
import styles from './index.less'
function hasErrors (fieldsError) {
  
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {
  componentDidMount () {
    const { type, edit } = this.props
    
    if (type == 'edit') {
      this.props.form.setFieldsValue({
        email: edit.email,
        inviteCode: edit.inviteCode,
        roleId:edit.roleId,
        password: '',
      })
      this.setState({
        childrenPercent: edit.chidrenCommissionRate,
        parentPercent:edit.parentCommissionRate
      })
    } else {
      if (storage.get('cutuserInfo').roleId == 3) {
        this.props.form.setFieldsValue({
          roleId:4
        })
      }
      
    }
   
  }
  state = {
    childrenPercent: 0,
    parentPercent: 0,
    visible: false,
    loading:false, //loding 
    addAndOpen: {
      email: '',
      roleId:4,
    },//添加账户1， 开户成功2
    timer:null  //定时器
  }


  // 切换角色佣金比例
  handleSubmit = e => {
    e.preventDefault();
    let code = this.props.form.getFieldsValue().inviteCode ? this.props.form.getFieldsValue().inviteCode : storage.get('cutuserInfo').inviteCode
    
    if (storage.get('cutuserInfo').roleId == 1) {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            loading:true
          })
          code = values.inviteCode
          GetScale({
            inviteCode:code,
            roleId:e.target.value
          }).then(res => {
            if (res?.success) {
              this.setState({
                childrenPercent: res?.data?.childrenPercent,
                parentPercent: res.data?.parentPercent,
                loading:false
              })
            }
          })
        }
      })
    } else {
      this.setState({
        loading:true
      })
      GetScale({
        inviteCode:code,
        roleId:e.target.value
      }).then(res => {
        if (res?.success) {
          this.setState({
            childrenPercent: res?.data?.childrenPercent,
            parentPercent: res.data?.parentPercent,
            loading:false
          })
        }
      })
    }
    
  };
  // 提交表单
  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!this.state.childrenPercent) return message.error(formatMessage({ id: 'CommissionProportionFirst' }))
       const params= {
          email: values.email,
          password: values.password,
          roleId: values.roleId,
          inviteCode: values.inviteCode,
          parentPercent: this.state.parentPercent,
         childrenPercent: this.state.childrenPercent,
       }
        if (this.props.type == 'add') {
          if (!this.state.visible) {
            setEmail(values.inviteCode).then(res => {
              if (res?.data) {
                this.setState({
                  addAndOpen: {
                    email: res.data,
                    roleId:values.roleId,
                  },
                  visible: true,
                 });
              }
            })
           
          } else {
            userAdd(params).then(res => {
            if (res?.success) {
              message.success(formatMessage({id:'AddedSuccessfully'}))
              this.props.useInfoList({})
              this.props.onClose()
            }
          })
          }
          
        } else {
          userUpData({...params,userId:this.props.edit.userId}).then(res => {
            if (res?.success) {
              message.success(formatMessage({id:'ModifiedSuccessfully'}))
              this.props.useInfoList({})
              this.props.onClose()
            }
          })
        }
       
      }
    })
  }
  // 添加提示
  hideModal = () => {
    this.setState({
      visible: false,
    });

  };
    // 自动获取佣金比例，
  // 切换角色
  onFocusCode = async() => {
   await GetScale({
      inviteCode: this.props.form.getFieldsValue().inviteCode,
      roleId:this.props.form.getFieldsValue().roleId
    }).then(res => {
      if (res?.success) {
        this.setState({
          childrenPercent: res.data?.childrenPercent,
          parentPercent: res.data?.parentPercent,
          loading:false
        })
      }
    })
  }
  // 节流阀获取数据
  onChangInCode =(fn, delay) => {
    this.setState({
      loading:true
    })
    this.state.timer && clearTimeout(this.state.timer)
    this.setState({
      timer: setTimeout(() => {
        fn.apply(this)
      }, delay)
   })     
  }
  // 输入密码
  onPassword = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (storage.get('cutuserInfo').roleId == 1) return
        this.setState({
          loading:true
        })
        GetScale({
          inviteCode: storage.get('cutuserInfo').inviteCode,
          roleId:this.props.form.getFieldsValue().roleId
        }).then(res => {
          if (res?.success) {
            this.setState({
              childrenPercent: res.data?.childrenPercent,
              parentPercent: res.data?.parentPercent,
              loading:false
            })
          }
        })
      } else {
        return
      }
    })
  }
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const { childrenPercent, parentPercent } = this.state
   const { TextArea } = Input;

    return (
      <Form   style={{marginTop:'20px'}}  className={styles.addForm}  labelCol={{ span: 12 }} wrapperCol={{ span: 8 }} >
       
        <Form.Item    label={formatMessage({ id: 'Account' })} >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email',
              message: formatMessage({id:'PleaseMailbox'})
              },
              {
              required: true,
              message: formatMessage({id:'yourEmail'}),
              }],
          })(
            <Input
              placeholder="email"
              disabled={this.props.type=='edit'}
            />,
          )}
        </Form.Item>
        {
          this.props.type=='add'? <Form.Item  label={formatMessage({ id: 'password' })} onChange={async()=>await debounce(this.onPassword(),1000)}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: formatMessage({id:'PleasePassword'}) }],
          })(
            <Input
              placeholder="password"
              type='password'
            />,
          )}
        </Form.Item>: <Form.Item  label={formatMessage({ id: 'password' })}>
          {getFieldDecorator('password', {
            rules: [{ required: false, message: formatMessage({id:'PleasePassword'}) }],
          })(
            <Input
              placeholder="******"
              type='password'
            />,
          )}
        </Form.Item>
       }
        <Form.Item  label={formatMessage({ id: 'Role' })}>
          {getFieldDecorator('roleId', {
            rules: [{ required: true, message: formatMessage({id:'PleRole'}) }],
          })(
            <Radio.Group onChange={this.handleSubmit}>
            {
              this.props.currentRole.map(item => {
                return  <Radio key={item.roleId} value={item.roleId} style={{width:'100%'}}>{formatMessage({id:item.roleCode})}</Radio>
              })
            } </Radio.Group>
          )}
        </Form.Item>
        {
          storage.get('cutuserInfo').roleId ==1? <Form.Item  label={formatMessage({ id: 'SuperiorInvitationCode' })}>
          {getFieldDecorator('inviteCode', {
            rules: [{ required: true, message: formatMessage({id:'recommenderCode'}) }],
          })(
            <Input
              placeholder="inviteCode"
              disabled={this.props.edit.inviteCode && this.props.type=='edit' ? true : false}
              onChange={()=>this.onChangInCode(this.onFocusCode,2000)}
            />,
          )}
        </Form.Item>:''
       }
         <Spin size='small' indicator={<Icon type='loadingOutlined' />} spinning={this.state.loading}>
        <Form.Item  label={formatMessage({ id: 'comRate' })} >
          {getFieldDecorator('parentPercent', {
            rules: [{ required: false, message: formatMessage({id:'PleaseEnter'}) }],
          })(
            <TextArea rows={2} placeholder={`${formatMessage({ id: 'KeepForOneself' })}:${parentPercent?parentPercent:0}\n${formatMessage({ id: 'partner' })}:${childrenPercent?childrenPercent:0}`} disabled style={{ resize: 'none' }} /> 
          )}
        </Form.Item>
        </Spin>
        <Form.Item wrapperCol={{offset:8,span:16}}>
        <Button onClick={this.submit}
           type="primary"
           style={{ marginBottom: '30px' ,marginLeft:'40px'}} disabled={hasErrors(getFieldsError())}>
            {formatMessage({id:'Submit'})}
           </Button>
           </Form.Item>
       
          
        <Modal
          visible={this.state.visible}
         footer={null}
          centered
          destroyOnClose
          width={300}
          bodyStyle={{ textAlign: 'center' }}
          onCancel={this.hideModal}
        >
          <div style={{ margin: '15px' }}>
            {formatMessage({ id: 'addedbecome' })}
            {` `}{this.state.addAndOpen.email }{` `}
            {this.state.addAndOpen.roleId==2?formatMessage({id:'country_partner'}):this.state.addAndOpen.roleId==3?formatMessage({id:'city_partner'}):this.state.addAndOpen.roleId==4?formatMessage({id:'community_partner'}):''}
            {formatMessage({ id: 'sureToAdd' })}</div>
         
          <div>
            <Button   onClick={this.hideModal} style={{marginRight:'10px'}}>{formatMessage({id:'cancel'})}</Button>
            <Button onClick={this.submit}>{formatMessage({id:'confirm'})}</Button>
          </div>
        </Modal>
      </Form>
    );
  }
}

export default  Form.create({ name: 'horizontal_login' })(HorizontalLoginForm);
