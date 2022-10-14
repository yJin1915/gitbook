import React, { Component, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  Tree,
  Icon,
  Popover,
  Popconfirm,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Menu.less';
//import Operation from 'antd/lib/transfer/operation';
import { formItemLayout0515, widthStyleP100 } from '@/utils/antdConfig';
import menuRouterData from '../../../config/router.config';

const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = Tree;

const iconArr = [
  'alert',
  'account-book',
  'api',
  'appstore',
  'audio',
  'bank',
  'bell',
  'book',
  'build',
  'bulb',
  'calculator',
  'calendar',
  'camera',
  'car',
  'carry-out',
  'cloud',
  'code',
  'compass',
  'contacts',
  'container',
  'control',
  'credit-card',
  'crown',
  'customer-service',
  'dashboard',
  'database',
  'dislike',
  'environment',
  'experiment',
  'eye-invisible',
  'eye',
  'file-add',
  'file-excel',
  'file-exclamation',
  'file-image',
  'file-markdown',
  'file-pdf',
  'file-ppt',
  'file-text',
  'file-unknown',
  'file-word',
  'file-zip',
  'file',
  'filter',
  'fire',
  'flag',
  'folder-add',
  'folder-open',
  'folder',
  'frown',
  'funnel-plot',
  'gift',
  'hdd',
  'heart',
  'home',
  'hourglass',
  'idcard',
  'insurance',
  'interaction',
  'layout',
  'like',
  'lock',
  'medicine-box',
  'mail',
  'meh',
  'message',
  'mobile',
  'money-collect',
  'notification',
  'pay-circle',
  'phone',
  'picture',
  'play-square',
  'printer',
  'profile',
  'project',
  'property-safety',
  'pushpin',
  'read',
  'reconciliation',
  'red-envelope',
  'rest',
  'rocket',
  'safety-certificate',
  'save',
  'security-scan',
  'schedule',
  'setting',
  'shop',
  'shopping',
  'skin',
  'smile',
  'sound',
  'star',
  'tablet',
  'switcher',
  'tag',
  'tags',
  'thunderbolt',
  'tool',
  'trophy',
  'unlock',
  'usb',
  'video-camera',
  'wallet',
  'apartment',
  'audit',
  'barcode',
  'bars',
  'block',
  'border',
  'branches',
  'ci',
  'cloud-download',
  'cloud-server',
  'cloud-sync',
  'cloud-upload',
  'cluster',
  'coffee',
  'copyright',
  'deployment-unit',
  'desktop',
  'disconnect',
  'dollar',
  'download',
  'ellipsis',
  'euro',
  'exception',
  'export',
  'file-done',
  'file-jpg',
  'file-protect',
  'file-search',
  'file-sync',
  'fork',
  'gateway',
  'global',
  'gold',
  'history',
  'import',
  'inbox',
  'key',
  'laptop',
  'line',
  'link',
  'loading-3-quarters',
  'loading',
  'man',
  'menu',
  'monitor',
  'more',
  'number',
  'paper-clip',
  'percentage',
  'pound',
  'poweroff',
  'pull-request',
  'qrcode',
  'reload',
  'robot',
  'safety',
  'scan',
  'search',
  'select',
  'shake',
  'share-alt',
  'shopping-cart',
  'solution',
  'sync',
  'table',
  'team',
  'to-top',
  'trademark',
  'transaction',
  'upload',
  'user-add',
  'user-delete',
  'user',
  'usergroup-add',
  'usergroup-delete',
  'wifi',
  'woman',
];

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        parent_id: props.values.parent_id,
        icon: props.values.icon || '',
        title: props.values.title,
        order: props.values.order,
        uri: props.values.uri,
      },
    };
  }
  okHandle = () => {
    const { values, form, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate(fieldsValue, values.id);
    });
  };
  iconClick = type => {
    const { form } = this.props;
    form.setFieldsValue({
      icon: type,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { updateModalVisible, handleUpdateModalVisible, values, gData } = this.props;
    const { formVals } = this.state;

    const content = (
      <div style={{ width: 200, height: 200, overflowX: 'hidden', overflowY: 'scroll' }}>
        {iconArr.map((v, i) => (
          <Icon
            style={{ fontSize: 20, margin: 5 }}
            key={i}
            type={v}
            onClick={this.iconClick.bind(this, v)}
          />
        ))}
      </div>
    );
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="编辑菜单"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false, values)}
        okText="确定修改"
        onOk={this.okHandle}
        afterClose={() => handleUpdateModalVisible()}
        maskClosable={false}
      >
        <FormItem {...formItemLayout0515} label="父级菜单">
          {getFieldDecorator('parent_id', {
            rules: [{ required: true, message: '请选择父级菜单!' }],
            initialValue: Number(formVals.parent_id),
          })(
            <Select placeholder="请选择父级菜单" style={widthStyleP100}>
              <Option value={0}>根目录</Option>
              {gData.map((v, i) => (
                <Option key={i} value={v.id}>
                  {v.title}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout0515} label="标题">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入标题！' }],
            initialValue: formVals.title,
          })(<Input placeholder="请输入标题" />)}
        </FormItem>
        <FormItem {...formItemLayout0515} label="图标">
          <Popover content={content} trigger="click">
            {getFieldDecorator('icon', {
              rules: [{ required: false, message: '请选择图标！' }],
              initialValue: formVals.icon,
            })(<Input placeholder="请选择图标" />)}
          </Popover>
        </FormItem>
        <FormItem {...formItemLayout0515} label="排序">
          {getFieldDecorator('order', {
            rules: [{ required: false, message: '请输入排序！' }],
            initialValue: formVals.order,
          })(<Input placeholder="请输入排序" />)}
        </FormItem>
        <FormItem {...formItemLayout0515} label="路由">
          {getFieldDecorator('uri', {
            rules: [{ required: false, message: '请输入路由！' }],
            initialValue: formVals.uri,
          })(<Input placeholder="请输入路由" />)}
        </FormItem>
      </Modal>
    );
  }
}

@connect(({ menu_config, loading, menu }) => ({
  menu_config,
  menu,
  menu_configLoading: loading.effects['menu_config/fetch'],
}))
@Form.create()
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gData: menuRouterData[1].routes,
      expandedKeys: ['0-0', '0-0-0', '0-0-0-0'],
      updateFormValues: {},
    };
  }
  componentDidMount() {
    // this.getMenuList();
  }
  getMenuList = () => {
    const { dispatch } = this.props;
    const params = {
      _token: localStorage._token,
    };
    dispatch({
      type: 'menu_config/fetch',
      payload: params,
      callback: res => {
        if (res && res.status == 0) {
          this.setState({ gData: res.data });
        }
      },
    });
  };
  reloadMenu = () => {};

  onDragEnter = info => {
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };
  onDragEnd = info => {
    // console.log(this.state.gData)
  };

  onDrop = info => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = [...this.state.gData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    this.setState({
      gData: data,
    });
  };

  handleAdd = e => {
    if (e) {
      e.preventDefault();
    }
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      Object.keys(fieldsValue).forEach((v, i) => {
        if (fieldsValue[v] == undefined) {
          delete fieldsValue[v];
        }
      });
      dispatch({
        type: 'menu_config/add',
        payload: {
          ...fieldsValue,
          _token: localStorage._token,
        },
        callback: res => {
          if (res && res.status == 0) {
            message.success('添加成功');
            form.resetFields();
            this.getMenuList();
            this.reloadMenu();
          }
        },
      });
    });
  };

  saveMenu = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu_config/save',
      payload: {
        _order: JSON.stringify(this.state.gData),
        _token: localStorage._token,
      },
      callback: res => {
        if (res && res.status == 0) {
          message.success('保存成功');
          this.getMenuList();
          this.reloadMenu();
        }
      },
    });
  };
  iconClick = type => {
    const { form } = this.props;
    form.setFieldsValue({
      icon: type,
    });
  };
  onDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu_config/delete',
      payload: {
        id,
        _token: localStorage._token,
      },
      callback: res => {
        if (res && res.status == 0) {
          message.success('删除成功');
          this.getMenuList();
          this.reloadMenu();
        }
      },
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      updateFormValues: record || {},
    });
  };
  handleUpdate = (fields, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu_config/update',
      payload: {
        _token: localStorage._token,
        id,
        ...fields,
      },
      callback: res => {
        if (res && res.status == 0) {
          message.success('修改成功');
          this.getMenuList();
          this.reloadMenu();
          this.handleUpdateModalVisible();
        }
      },
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { updateModalVisible, updateFormValues, gData } = this.state;

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const formItemLayout0515 = {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
    };
    const content = (
      <div style={{ width: 200, height: 200, overflowX: 'hidden', overflowY: 'scroll' }}>
        {iconArr.map((v, i) => (
          <Icon
            style={{ fontSize: 20, margin: 5 }}
            key={i}
            type={v}
            onClick={this.iconClick.bind(this, v)}
          />
        ))}
      </div>
    );
    const MenuNode = props => {
      return (
        <div className={styles.menuNode}>
          <div className="left">
            <Icon type="menu" />
            <span>{props.node}</span>
          </div>
          <div className="right">
            <Icon
              type="edit"
              style={{ fontSize: '20px', color: '#1890FF', marginRight: '10px' }}
              onClick={() => this.handleUpdateModalVisible(true, props.node)}
            />
            <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(props.node.id)}>
              <Icon type="delete" style={{ fontSize: '20px', color: '#1890FF' }} />
            </Popconfirm>
          </div>
        </div>
      );
    };
    const loop = data =>
      data.map(item => {
        if (item.routes && item.routes.length) {
          return (
            <TreeNode key={item.path} title={<MenuNode node={item.name} />}>
              {loop(item.routes)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.path} title={<MenuNode node={item.name} />} />;
      });
    return (
      <PageHeaderWrapper>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card bodyStyle={{ paddingTop: 0 }} bordered={false} title="管理菜单">
              <div className={styles.operation}>
                <Button onClick={this.saveMenu}>保存</Button>
              </div>
              <Tree
                className="draggable-tree"
                defaultExpandedKeys={this.state.expandedKeys}
                draggable
                blockNode
                onDragEnter={this.onDragEnter}
                onDrop={this.onDrop}
                onDragEnd={this.onDragEnd}
              >
                {loop(this.state.gData)}
              </Tree>
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card bodyStyle={{ paddingTop: 10 }} bordered={false} title="添加菜单">
              <Form {...formItemLayout0515} layout="horizontal" onSubmit={this.handleAdd}>
                <FormItem label="父级菜单">
                  {getFieldDecorator('parent_id', {
                    rules: [{ required: true, message: '请选择父级菜单!' }],
                  })(
                    <Select placeholder="请选择父级菜单">
                      <Option value={0}>根目录</Option>
                      {this.state.gData.map((v, i) => (
                        <Option key={v.id} value={v.id}>
                          {v.title}
                        </Option>
                      ))}
                      {this.state.gData.map((v, i) => {
                        if (v.children) {
                          return v.children.map(vv => {
                            return (
                              <Option key={vv.id} value={vv.id}>
                                {vv.title}
                              </Option>
                            );
                          });
                        }
                      })}
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout0515} label="标题">
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入标题！' }],
                  })(<Input placeholder="请输入标题" />)}
                </FormItem>
                <FormItem label="是否显示">
                  {getFieldDecorator('show_menu', {
                    rules: [{ required: true, message: '请选择是否显示在菜单中!' }],
                    initialValue: 1,
                  })(
                    <Select placeholder="请选择是否显示在菜单中">
                      <Option value={1}>显示</Option>
                      <Option value={0}>不显示</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout0515} label="图标">
                  <Popover content={content} trigger="click">
                    {getFieldDecorator('icon', {
                      rules: [{ required: false, message: '请选择图标！' }],
                    })(<Input placeholder="请选择图标" />)}
                  </Popover>
                </FormItem>
                <FormItem {...formItemLayout0515} label="路由">
                  {getFieldDecorator('uri', {
                    rules: [{ required: false, message: '请输入路由！' }],
                  })(<Input placeholder="请输入路由" />)}
                </FormItem>
                <FormItem {...formItemLayout0515} label="排序">
                  {getFieldDecorator('order', {
                    rules: [{ required: false, message: '请输入顺序！' }],
                  })(<Input placeholder="请输入顺序" />)}
                </FormItem>
                <FormItem {...formItemLayout0515} label="组件路径">
                  {getFieldDecorator('component', {
                    rules: [{ required: false, message: '请输入组件路径！' }],
                  })(<Input placeholder="请输入组件路径" />)}
                </FormItem>
                <FormItem {...formItemLayout0515} label="重定向地址">
                  {getFieldDecorator('redirect', {
                    rules: [{ required: false, message: '请输入重定向地址！' }],
                  })(<Input placeholder="请输入重定向地址" />)}
                </FormItem>
                <FormItem {...formItemLayout0515} label="扩展参数">
                  {getFieldDecorator('par_v1', {
                    rules: [{ required: false, message: '请输入扩展参数！' }],
                  })(<Input placeholder="请输入扩展参数" />)}
                </FormItem>

                <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                  <Button type="primary" htmlType="submit">
                    确定
                  </Button>
                </FormItem>
              </Form>
            </Card>
          </Col>
        </Row>
        {updateFormValues && Object.keys(updateFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            gData={gData}
            values={updateFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

// export default Menu;
