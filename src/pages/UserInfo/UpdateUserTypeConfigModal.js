import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Form, Input, message, InputNumber, Radio, Select, Divider } from 'antd';
import {
  widthStyle240,
  widthStyleP100,
  formItemLayout0615,
  formItemLayout0715,
} from '@/utils/antdConfig';
import { userTypeArr, vipTypeArr, rechargeTypeArr } from './configParams';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ user_type_config }) => ({
  user_type_config,
}))
@Form.create()
class UpDateSignConfigModal extends PureComponent {
  state = {
    btnLoading: false,
  };

  closeModal = () => {
    const { setSingleParam } = this.props;
    setSingleParam('updateModalShow', false);
    setSingleParam('isEdit', false);
    setSingleParam('curDetail', {});
    this.setState({ btnLoading: false });
  };

  saveUpdate = () => {
    const {
      form,
      dispatch,
      user_type_config: { isEdit, curDetail },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({ btnLoading: true });
      const {
        game_app_id,
        name,
        user_type,
        describe,
        recharge_min,
        recharge_max,
        relation,
        give_min,
        give_max,
        value,
        get_value_method,
      } = fieldsValue;
      const recharge = {
        min: recharge_min,
        max: recharge_max,
      };
      const vip = {
        relation,
        give_min,
        give_max,
        value,
        get_value_method,
      };
      let params = {
        game_app_id,
        name,
        user_type,
        describe,
        recharge: JSON.stringify(recharge),
        vip_level: JSON.stringify(vip),
        _token: localStorage._token,
      };
      dispatch({
        type: `user_type_config/${isEdit ? 'modify' : 'add'}`,
        payload: isEdit ? Object.assign(params, { id: curDetail.id }) : params,
        callback: res => {
          _updateCallback(res);
        },
      });
    });

    const _updateCallback = res => {
      if (res && res.status == 0) {
        const { searchFn, form } = this.props;
        message.success('操作成功');
        searchFn(1);
        this.closeModal();
        form.resetFields();
      }
      this.setState({ btnLoading: false });
    };
  };

  render() {
    const {
      user_type_config: { updateModalShow, appList, isEdit, curDetail },
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Modal
        width={600}
        bodyStyle={{ overflowY: 'auto' }}
        destroyOnClose
        title={`${isEdit ? '编辑' : '新建'}用户类型配置`}
        visible={updateModalShow}
        okText="确定"
        onOk={this.saveUpdate}
        onCancel={this.closeModal}
        maskClosable={false}
        confirmLoading={this.state.btnLoading}
      >
        <FormItem label="所属游戏APP" {...formItemLayout0615}>
          {getFieldDecorator('game_app_id', {
            initialValue: isEdit && curDetail && curDetail.game_app_id ? curDetail.game_app_id : '',
            rules: [{ required: true, message: '请选择所属游戏APP' }],
          })(
            <Select style={widthStyleP100}>
              {appList.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.game_name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout0615} label="名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入名称！' }],
            initialValue: isEdit && curDetail && curDetail.name ? curDetail.name : '',
          })(<Input placeholder="请输入名称" />)}
        </FormItem>
        <FormItem label="用户类型" {...formItemLayout0615}>
          {getFieldDecorator('user_type', {
            initialValue: isEdit && curDetail && curDetail.user_type ? curDetail.user_type : '',
            rules: [{ required: true, message: '请选择用户类型' }],
          })(
            <Select style={widthStyleP100}>
              {userTypeArr.map(item => (
                <Option key={item.value} value={item.value}>
                  {item.title}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <Divider dashed />
        <h4>充值相关：（默认大于等于最小，小于等于最大）</h4>
        <FormItem {...formItemLayout0615} label="最小充值数" extra="值为-1代表不限制">
          {getFieldDecorator('recharge_min', {
            rules: [{ required: true, message: '请输入最小充值数！' }],
            initialValue:
              isEdit &&
              curDetail &&
              curDetail.recharge &&
              (curDetail.recharge.min || curDetail.recharge.min == 0)
                ? curDetail.recharge.min
                : '',
          })(<InputNumber min={-1} step={1} style={widthStyle240} />)}
        </FormItem>
        <FormItem {...formItemLayout0615} label="最大充值数" extra="值为-1代表不限制">
          {getFieldDecorator('recharge_max', {
            rules: [{ required: true, message: '请输入最大充值数！' }],
            initialValue:
              isEdit &&
              curDetail &&
              curDetail.recharge &&
              (curDetail.recharge.max || curDetail.recharge.max == 0)
                ? curDetail.recharge.max
                : '',
          })(<InputNumber min={-1} step={1} style={widthStyle240} />)}
        </FormItem>
        <Divider dashed />
        <FormItem {...formItemLayout0715} label="充值和VIP等级关系">
          {getFieldDecorator(`relation`, {
            initialValue:
              isEdit && curDetail && curDetail.vip_level && curDetail.vip_level.relation
                ? curDetail.vip_level.relation
                : '',
            rules: [{ required: true }],
          })(
            <Radio.Group>
              <Radio value={1}>并且</Radio>
              <Radio value={2}>或者</Radio>
            </Radio.Group>
          )}
        </FormItem>
        <Divider dashed />
        <h4>VIP等级相关：</h4>
        <FormItem {...formItemLayout0615} label="等级" style={{ marginBottom: 0 }}>
          <Row>
            <Col span={12}>
              <FormItem label="条件" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('get_value_method', {
                  initialValue:
                    isEdit &&
                    curDetail &&
                    curDetail.vip_level &&
                    curDetail.vip_level.get_value_method
                      ? curDetail.vip_level.get_value_method
                      : '',
                  rules: [{ required: true, message: '请选择条件' }],
                })(
                  <Select style={{ width: 80 }}>
                    {vipTypeArr.map(item => (
                      <Option key={item.value} value={item.value}>
                        {item.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="等级" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                {getFieldDecorator('value', {
                  rules: [{ required: true, message: '请选择等级！' }],
                  initialValue:
                    isEdit &&
                    curDetail &&
                    curDetail.vip_level &&
                    (curDetail.vip_level.value || curDetail.vip_level.value == 0)
                      ? curDetail.vip_level.value
                      : '',
                })(
                  <Select style={{ width: 80 }}>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(item => (
                      <Option key={item} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem {...formItemLayout0615} label="最小转账数" extra="值为-1代表不限制">
          {getFieldDecorator('give_min', {
            rules: [{ required: true, message: '请输入最小转账数！' }],
            initialValue:
              isEdit &&
              curDetail &&
              curDetail.vip_level &&
              (curDetail.vip_level.give_min || curDetail.vip_level.give_min == 0)
                ? curDetail.vip_level.give_min
                : '',
          })(<InputNumber min={-1} step={1} style={widthStyle240} />)}
        </FormItem>
        <FormItem {...formItemLayout0615} label="最大转账数" extra="值为-1代表不限制">
          {getFieldDecorator('give_max', {
            rules: [{ required: true, message: '请输入最大转账数！' }],
            initialValue:
              isEdit &&
              curDetail &&
              curDetail.vip_level &&
              (curDetail.vip_level.give_max || curDetail.vip_level.give_max == 0)
                ? curDetail.vip_level.give_max
                : '',
          })(<InputNumber min={-1} step={1} style={widthStyle240} />)}
        </FormItem>

        <Divider dashed />
        <FormItem {...formItemLayout0615} label="用户类型描述">
          {getFieldDecorator('describe', {
            initialValue: isEdit && curDetail && curDetail.describe ? curDetail.describe : '',
            rules: [{ required: true, message: '请输入用户类型描述！' }],
          })(<TextArea placeholder="请输入用户类型描述" maxLength={250} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default UpDateSignConfigModal;
