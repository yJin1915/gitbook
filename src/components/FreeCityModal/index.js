import React from 'react'
import { Table,Switch, Icon,Modal,Button} from "antd";
import { formatMessage ,FormattedMessage} from 'umi/locale';

export default function FCModal (props) {
  const { visible, texts, hideModal ,DisOrend} = props
  return (
    <Modal
    visible={visible}
    onOk={hideModal}
      onCancel={hideModal}
      centered
      width='300px'
      footer={null}
      destroyOnClose={true}
      keyboard
    > 
        <div style={{margin:'20px'}}><FormattedMessage id={texts} /></div>
      <div style={{textAlign:'center'}}>
        <Button style={{marginRight:'10px'}} onClick={hideModal}>
        <FormattedMessage id='cancel' />
        </Button>
        <Button type="primary" onClick={DisOrend}>
         <FormattedMessage id='confirm' />
        </Button></div>
  </Modal>
  )
}
