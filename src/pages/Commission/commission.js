import React from 'react';
import { Card ,Button, Form, Input,InputNumber, message} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage, FormattedMessage } from 'umi/locale';
import styles from './Commission.less'
import { GetCommission,SetCommission } from '@/api/Commission';
import Secret from "@/utils/secret";

const { TextArea } = Input;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
@Form.create()
class CommissionPage extends React.Component {
  componentDidMount() {
    GetCommission().then((res) => {
      if(res?.success){
        this.props.form.setFieldsValue({
          id:res.data.id,
          cycleTime: res.data.cycleTime,
          minCommissionAmount: res.data.minCommissionAmount,
          walletAddress:res.data.walletAddress,
          priKey: Secret.Decrypt(res.data.priKey),
          remark:res.data.remark
        })
      }
      
    })
    this.props.form.validateFields();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.priKey = Secret.Encrypt(values.priKey)
        SetCommission(values).then((res) => {
          if(res?.success){
            message.success(formatMessage({id:'ModifiedSuccessfully'}))
          }
          
        })
      }
    });
  };


  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const cycleError = isFieldTouched('cycleTime') && getFieldError('cycleTime');
    const transferError = isFieldTouched('minCommissionAmount') && getFieldError('minCommissionAmount');
    const walletAddressError = isFieldTouched('walletAddress') && getFieldError('walletAddress');
    const privateKeyError = isFieldTouched('priKey') && getFieldError('priKey');
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
      <Form  onSubmit={this.handleSubmit}>
      <Form.Item className={styles.hide}>
          {getFieldDecorator('id')(
            <Input
            />,
          )}
        </Form.Item>

        <Form.Item className={styles.formItem} validateStatus={cycleError ? 'error' : ''} help={cycleError || ''}>
        {formatMessage({ id: 'cycle' })} : {formatMessage({ id: 'day' })}
          {getFieldDecorator('cycleTime', {
            rules: [{ required: true, message: formatMessage({ id: 'enterCycle' }) }],
          })(
            <InputNumber  min={0} max={23} step={1}
            />,
          )}
          
        </Form.Item>
        <Form.Item className={styles.formItem} validateStatus={transferError ? 'error' : ''} help={transferError || ''}>
        {formatMessage({ id: 'transfer' })}
          {getFieldDecorator('minCommissionAmount', {
            rules: [{ required: true, message: formatMessage({ id: 'enterTransfer' }) }],
          })(
            <InputNumber  min={0}
            />,
          )}
        </Form.Item>
        <Form.Item className={styles.formItem} validateStatus={walletAddressError ? 'error' : ''} help={walletAddressError || ''}>
          {formatMessage({ id: 'WalletAddress' })}
          {getFieldDecorator('walletAddress', {
            rules: [{ required: true, message: formatMessage({ id: 'user' }) }],
          })(
            <Input
            />,
          )}
        </Form.Item>
        <Form.Item className={styles.formItem} validateStatus={privateKeyError ? 'error' : ''} help={privateKeyError || ''}>
        {formatMessage({ id: 'privateKey' })}
          {getFieldDecorator('priKey', {
            rules: [{ required: true, message: formatMessage({ id: 'enterPrivateKey' }) }],
          })(
            <TextArea rows={4} />,
          )}
        </Form.Item>
        <Form.Item className={styles.formItem}>
        {formatMessage({ id: 'remark' })}
          {getFieldDecorator('remark')(
            <Input />,
          )}
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
           {formatMessage({ id: 'Submit' })}
          </Button>
        </Form.Item>
      </Form>
      </Card>
      </PageHeaderWrapper>
    );
  }
}
export default CommissionPage;




