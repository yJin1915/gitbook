import React, { useState } from 'react'
import { formatMessage ,FormattedMessage} from 'umi/locale';

import { Card, Row, Col, Form, Input, Button } from 'antd';
import { storage } from '@/utils/utils';
import { FormInfo, User, userProfitInfo, userTypeInfo } from '@/api/User';
import router from 'umi/router';
const { TextArea } = Input;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {
  componentDidMount() {
    // To disable submit button at the beginning.
    this.setState = {
      info:storage.get('cutuserInfo')?storage.get('cutuserInfo'):{}
    }
    if (storage.get('cutuserInfo').formStatus-0 == 1) {
       userTypeInfo(storage.get('cutuserInfo').userId).then(res => {
      if (res?.data) {
        this.props.form.setFieldsValue({ ...res.data })
        console.log(res.data);
       }
     })
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        userProfitInfo(values).then(res => {
          if (res?.success) {
             return User()  
          }
        }).then(res => {
          if (res?.success) {
            storage.set('cutuserInfo', { ...res.data.user, ...res.data.role})
            router.push('/customer/management/index')
          }
        })
      }
    });
  };
  state = {
    info:{}
  }

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const usernameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <Card  bordered={false} >
        <Col push={2}>
      <Form layout="horizontal" onSubmit={this.handleSubmit} style={{width:'800px'}}>
        <Form.Item label={formatMessage({id:'name'})}>
          {getFieldDecorator('partnerName', {
            rules: [{ required: true, message: formatMessage({id:'PleaseEnter'}) }],
          })(
            <Input
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item label={formatMessage({id:'Telephone'})}>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: formatMessage({id:'PleaseEnter'}) }],
          })(
            <Input
              placeholder="phone"
            />,
          )}
        </Form.Item>
        <Form.Item label={formatMessage({id:'address'})}>
          {getFieldDecorator('address', {
            rules: [{ required: true, message: formatMessage({id:'PleaseEnter'}) }],
          })(
            <Input
              placeholder="address"
            />,
            )}
          </Form.Item>
            
           <Form.Item  label={formatMessage({id:'DiscordId'})}>
          {getFieldDecorator('tgId', {
            rules: [{ required: true, message:formatMessage({id:'PleaseEnter'}) }],
          })(
            <Input
              placeholder="tgId"
            />,
            )}
          </Form.Item>
          <Form.Item  label={formatMessage({id:'telegramId'})}>
          {getFieldDecorator('twitterId', {
            rules: [{ required: true, message: formatMessage({id:'PleaseEnter'})}],
          })(
            <Input
              placeholder="twitterId"
            />,
          )}
            </Form.Item>
            {
              storage.get('cutuserInfo').roleId == 3 ? <>
                   <Form.Item  label={formatMessage({id:'FCview'})}>
          {getFieldDecorator('knowFreeCity', {
            rules: [{ required: true, message: formatMessage({id:'PleaseEnter'}) }],
          })(
            <TextArea
              placeholder="knowFreeCity"
              rows={3}
            />,
          )}
          </Form.Item>
          <Form.Item  label={formatMessage({id:'Torture'})}>
          {getFieldDecorator('projectExperience', {
            rules: [{ required: true, message: formatMessage({id:'PleaseEnter'}) }],
          })(
            <TextArea
              placeholder="knowFreeCity"
              rows={3}
            />,
          )}
          </Form.Item>
          <Form.Item label={formatMessage({id:'PromotionTeam'})}>
          {getFieldDecorator('promoteTeam', {
            rules: [{ required: true, message: formatMessage({id:'PleaseEnter'}) }],
          })(
            <TextArea
              placeholder="knowFreeCity"
              rows={3}
            />,
          )}
        </Form.Item>
        <Form.Item  label={formatMessage({id:'HowToPromote'})}>
          {getFieldDecorator('promoteWay', {
            rules: [{ required: true, message: formatMessage({id:'PleaseEnter'}) }],
          })(
            <TextArea
            placeholder="knowFreeCity"
            rows={3}
          />,
          )}
        </Form.Item>
        <Form.Item  label={formatMessage({id:'ProjectSupport'})}>
          {getFieldDecorator('supportNeeded', {
            rules: [{ required: true, message: formatMessage({id:'PleaseEnter'}) }],
          })(
            <TextArea
              placeholder="knowFreeCity"
              rows={3}
            />,
          )}
                </Form.Item>
              </> : <>
              <Form.Item  label={formatMessage({id:'promoterOfFreecity'})}>
          {getFieldDecorator('promoteWay', {
            rules: [{ required: true, message: formatMessage({id:'PleaseEnter'}) }],
          })(
            <TextArea
            placeholder="knowFreeCity"
            rows={3}
          />,
          )}
          </Form.Item>
              </>
            }
            
            <Form.Item>
            <Col >
              {
                storage.get('cutuserInfo').formStatus==0 ?
               <> <Form.Item  label={formatMessage({id:'remarks'})}>
               {getFieldDecorator('FreeCityBackForm', {
                 rules: [{ required: false, message: formatMessage({id:'PleaseEnter'}) }],
               })(
                 <TextArea
                  placeholder={formatMessage({id:'FreeCityBackForm'})}
                   rows={1}
                   disabled
               />,
               )}
                   </Form.Item>
                    <Button type="primary" htmlType='submit' style={{marginLeft:'20px'}}>{formatMessage({id:'Submit'})}</Button>
                    </> 
               : ''
                }
                 </Col>
          
        </Form.Item>
        </Form>
        </Col>
        </Card>
    );
  }
}

export default  Form.create({ name: 'horizontal_login' })(HorizontalLoginForm);




