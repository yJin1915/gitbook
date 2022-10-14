import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Select, Icon, Button, message, Divider, Popconfirm, Card } from 'antd';
import StandardTable from '@/components/StandardTable';
import UpdateUserTypeConfigModal from './UpdateUserTypeConfigModal';
import { isEmptyObject, debounce } from '@/utils/utils';
import styles from './styles.less';
import { formItemLayout0618, widthStyleP100 } from '@/utils/antdConfig';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { userTypeObj } from './configParams';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ user_type_config, loading }) => ({
  user_type_config,
  loading: loading.effects['user_type_config/fetch'],
}))
class UserTypeConfig extends PureComponent {
  columns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: '10%',
      align: 'center',
    },
    {
      title: '游戏APP',
      dataIndex: 'game_app_name',
      width: '10%',
      align: 'center',
    },
    {
      title: '用户类型',
      dataIndex: 'user_type',
      render: (text, record) => <span>{userTypeObj[record.user_type] || '未定义'}</span>,
      width: '12%',
      align: 'center',
    },
    // {
    //   title: '充值',
    //   children: [
    //     {
    //       title: '最小充值',
    //       dataIndex: 'min',
    //       render: (text, record) => <span>{record?.recharge?.min ?? ''}</span>,
    //       width: '8%',
    //       align: 'center',
    //     },
    //     {
    //       title: '最多充值',
    //       dataIndex: 'max',
    //       render: (text, record) => <span>{record?.recharge?.max ?? ''}</span>,
    //       width: '8%',
    //       align: 'center',
    //     },
    //   ],
    // },
    {
      title: '描述',
      dataIndex: 'describe',
      width: '20%',
      align: 'center',
    },
    {
      title: '条件数据源',
      dataIndex: 'condition',
      width: '20%',
      align: 'center',
    },
    {
      title: '新增时间',
      dataIndex: 'add_time',
      width: '12%',
      align: 'center',
    },

    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={this.openModal.bind(this, 'updateModalShow', record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确认删除?" onConfirm={this.deleteConfig.bind(this, record.id)}>
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
      align: 'center',
      width: '10%',
    },
  ];

  componentDidMount() {
    let params = { game_app_id: '' };
    this.fetchList(params);
    this.fetchAppList();
  }

  handleFormReset = () => {
    this.props.form.resetFields();
    let params = { game_app_id: '' };
    this.fetchList(params);
  };

  fetchList = params => {
    const { dispatch, form } = this.props;
    const game_app_id = form.getFieldValue('game_app_id');
    let fetchParams = {
      _token: localStorage._token,
      ...params,
      game_app_id,
    };
    dispatch({
      type: 'user_type_config/fetch',
      payload: fetchParams,
    });
  };

  // 获取应用列表
  fetchAppList = () => {
    this.props.dispatch({
      type: 'user_type_config/fetchAppList',
      payload: { _token: localStorage._token },
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {
      dispatch,
      form: { getFieldValue },
    } = this.props;
    const game_app_id = getFieldValue('game_app_id');
    const params = {
      game_app_id,
      _token: localStorage._token,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'user_type_config/fetch',
      payload: params,
    });
  };

  handleSearch = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.fetchList(fieldsValue);
    });
  };

  //删除
  deleteConfig = id => {
    this.props.dispatch({
      type: 'user_type_config/delete',
      payload: {
        id,
        _token: localStorage._token,
      },
      callback: res => {
        if (res && res.status == 0) {
          message.success('删除成功');
          this.handleSearch();
        }
      },
    });
  };

  openModal = (modalName, curInfo = {}) => {
    if (!isEmptyObject(curInfo)) {
      this.setSingleParam('isEdit', true);
      this.setSingleParam('curDetail', curInfo);
    }
    this.setSingleParam(modalName, true);
  };

  setSingleParam = (pName, pValue) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user_type_config/setParam',
      data: { pName, pValue },
    });
  };

  render() {
    const {
      user_type_config: { data = {}, appList },
      loading,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Form onSubmit={debounce(this.handleSearch.bind(this, 1))}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={6} sm={24}>
                    <FormItem label="游戏APP" {...formItemLayout0618}>
                      {getFieldDecorator('game_app_id', {
                        initialValue: '',
                      })(
                        <Select
                          allowClear
                          placeholder="请选择游戏APP"
                          showSearch
                          style={widthStyleP100}
                        >
                          <Option value="">全部</Option>
                          {appList.map(item => (
                            <Option key={item.id} value={item.id}>
                              {item.game_name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={4} sm={24} offset={14}>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                      重置
                    </Button>
                  </Col>
                </Row>
              </Form>
              <Button type="primary" onClick={this.openModal.bind(this, 'updateModalShow', {})}>
                <Icon type="plus" />
                新增
              </Button>
            </div>
            <StandardTable
              loading={loading}
              data={data}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
              unRow={true}
              bordered
              pagination={false}
            />
          </div>
          <UpdateUserTypeConfigModal
            searchFn={this.handleSearch}
            setSingleParam={this.setSingleParam}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(UserTypeConfig);
