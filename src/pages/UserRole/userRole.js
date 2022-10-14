import React, { PureComponent, useEffect, useState } from 'react';
import { Card ,Table,Button, Modal,Icon, Form, Input, Col, message} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { rolesList } from '@/api/User';
import styles from './index.less'
import { EditRoleName } from '@/api/Role';
import router from 'umi/router';

class HorizontalLoginForm extends React.Component {
  componentDidMount() {
    this.props.form.setFieldsValue({ ...this.props.editUser })
    this.setState({
      description:this.props.editUser.description
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(this.props.editUser);
        EditRoleName({
          roleId: this.props.editUser.roleId,
          name: values.name,
          description:this.state.description
        }).then(res => {
          if (res?.success) {
            message.success(formatMessage({id:'ModifiedSuccessfully'}))
            this.props.isShowVisble(false)
          }
        })
      }
       
    });
  };
  state = {
    description:'' //修改角色的备注
  }
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    return (
      <Form layout="horizontal" onSubmit={this.handleSubmit} style={{
        margin: '50px'}}>
        <Form.Item  label={formatMessage({id:'RoleName'})}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item label={formatMessage({id:'remarks'})}>
        <Input.TextArea
            placeholder=''
            value={this.state.description}
            onChange={(e)=>this.setState({description:e.target.value})}
            />
        </Form.Item>
        <Form.Item>
          <Col push={10}>
           <Button type="primary" htmlType="submit" >
            {formatMessage({id:'preservation'})}
          </Button>
          </Col>
        </Form.Item>
      </Form>
    );
  }
}

const EditForm = Form.create({ name: 'horizontal_login' })(HorizontalLoginForm)
export default function userRole () {
  const columns = [
    {
      title: formatMessage({id:'SerialNumber'}),
      key: 'SerialNumber',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: formatMessage({id:'RoleName'}),
      dataIndex: "name",
      key: "name",
      render:(text)=>formatMessage({id:text})
    },
    {
      title: formatMessage({id:'remarks'}),
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        text === null || text === '' ? '/':text
      )
    },
    {
      title: formatMessage({id:'CreationTime'}),
      dataIndex: "createTime",
      key: "createTime",
      render: (text, record) => (
        text === null || text === '' ? '/':text
      )
    },
    {
      title: formatMessage({id:'UpdateTime'}),
      dataIndex: "updateTime",
      key: "updateTime",
      render: (text, record) => (
        text === null || text === '' ? '/':text
      )
    },
    {
      title: formatMessage({id:'operation'}),
      key: "operation",
      render: (text, record) => (
        <div>
           <Button type="primary" style={{marginRight:'10px'}} onClick={()=>edit(record)} size='small'>{formatMessage({id:'modify'})}</Button>
            <Button type="primary" size='small' disabled>{formatMessage({id:'SetPermissions'})}</Button>
        </div>
      )
    },
  ];
  // 列表数据
  const [dataSource, setDataSource] = useState([])
  // 获取数据方法
  const setData = () => {
    try {
      return rolesList().then((res) => {
        if (res?.success) {
            setDataSource([
            ...res.data
          ])
        } 
      })
    } catch (err) {
      message.error(err)
    }
  }
  useEffect(() => {
    setData()
    
  }, [])
  
  // 修改角色信息
  const [editUser,setEditUser]=useState({})
  const edit = (value) => {
    setEditUser({...value})
    setvisible(true)
  }
  const [visible, setvisible] = useState(false)
  const onClose = () => {
   
    setvisible(false)
  }
  // 关闭弹层
  const isShowVisble = async (value) => {
    await setData()
    setvisible(value)
  }
  return (
    <PageHeaderWrapper>
        {/* 首页内容区域 */}
        <Card bordered={false}>
        <Table dataSource={dataSource} columns={columns} rowKey={(text,record)=>text.roleId} bordered locale={{
             emptyText:formatMessage({id:'NoData'})
        }} pagination={false} />
        <Modal visible={visible}
           footer={null}
           destroyOnClose
            closable={false}
            bodyStyle={{
              padding:'0px'
            }}>
          <div className={styles._title}>
            <span>{formatMessage({id:'ModifyRole'}) }</span>
          <Icon type="close"  className='close' onClick={onClose} />
          </div>
          <EditForm  editUser={editUser} isShowVisble={isShowVisble}/>
        </Modal>
        </Card>
      </PageHeaderWrapper>
  )
}


