import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Input,
  Icon,
  Button,
  Modal,
  message,
  Divider,
  Popconfirm,
  Table,
  Tree,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Menu.less';
import { isArray } from 'util';
import { formItemLayout0515 } from '@/utils/antdConfig';
import menuRouterData from '../../../config/router.config';

const FormItem = Form.Item;
const { TreeNode } = Tree;

@Form.create()
class CreateForm extends PureComponent {
  static defaultProps = {
    handleAdd: () => {},
    handleModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: ['0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      checkedIds: [],
    };
  }
  okHandle = () => {
    const { form, handleAdd } = this.props;
    const { checkedIds } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue, checkedIds);
    });
  };

  onExpand = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = (checkedKeys, e) => {
    const { gData } = this.props;
    const temp = checkedKeys.concat(e.halfCheckedKeys);
    let allIdsMap = {}; // key:id
    const mapRoutes = data => {
      data.forEach((v, i) => {
        if (v.key) {
          allIdsMap[v.key] = v.id;
        }
        if (v.children && v.children.length > 0) {
          mapRoutes(v.children);
        }
      });
    };
    mapRoutes(gData);
    const checkedIds = temp.map(v => allIdsMap[v]);
    this.setState({
      checkedKeys,
      checkedIds,
    });
  };

  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  };

  render() {
    const { modalVisible, handleModalVisible, values, form, gData } = this.props;
    const MenuNode = props => {
      return (
        <div className={styles.menuNode}>
          <div className="left">
            <Icon type="menu" />
            <span>{props.node}</span>
          </div>
          <div className="right" />
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
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="添加角色"
        visible={modalVisible}
        onCancel={() => handleModalVisible(false, values)}
        okText="确定添加"
        onOk={this.okHandle}
        afterClose={() => handleModalVisible()}
        className={styles.modalContent}
        maskClosable={false}
      >
        <FormItem {...formItemLayout0515} label="角色名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入角色名称！' }],
          })(<Input placeholder="请输入角色名称" />)}
        </FormItem>
        <FormItem {...formItemLayout0515} label="菜单权限">
          {form.getFieldDecorator('menus', {
            rules: [{ required: false, message: '请选择菜单权限！' }],
          })(
            <Tree
              className="draggable-tree"
              defaultExpandedKeys={this.state.expandedKeys}
              checkable
              onExpand={this.onExpand}
              expandedKeys={this.state.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
              onSelect={this.onSelect}
              selectedKeys={this.state.selectedKeys}
            >
              {loop(gData)}
            </Tree>
          )}
        </FormItem>
      </Modal>
    );
  }
}

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
        name: props.values.name,
      },
      expandedKeys: ['0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      checkedIds: [],
    };
  }
  okHandle = () => {
    const { values, form, handleUpdate } = this.props;
    let { checkedIds } = this.state;

    if (JSON.stringify(checkedIds) == JSON.stringify(values.menus)) {
      checkedIds = '';
    }

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleUpdate(fieldsValue, checkedIds, values.id);
    });
  };
  onExpand = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = (checkedKeys, e) => {
    const { gData } = this.props;
    const temp = checkedKeys.concat(e.halfCheckedKeys);
    let allIdsMap = {}; // key:id
    const mapRoutes = data => {
      data.forEach((v, i) => {
        if (v.key) {
          allIdsMap[v.key] = v.id;
        }
        if (v.children && v.children.length > 0) {
          mapRoutes(v.children);
        }
      });
    };
    mapRoutes(gData);
    const checkedIds = temp.map(v => allIdsMap[v]);
    this.setState({
      checkedKeys,
      checkedIds,
    });
  };

  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  };
  componentDidMount() {
    const { gData } = this.props;
    const defaultMenus = this.props.values.menus || [];

    let allIdsMap = {}; // key:id
    const mapRoutes = data => {
      data.forEach((v, i) => {
        if (v.key) {
          allIdsMap[v.id] = v.key;
        }
        if (v.children && v.children.length > 0) {
          mapRoutes(v.children);
        }
      });
    };
    mapRoutes(gData);
    const checkedKeys = defaultMenus.map(v => allIdsMap[v]);
    this.setState({
      checkedKeys,
      checkedIds: defaultMenus,
    });
  }

  render() {
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      values,
      form,
      handleUpdate,
      gData,
    } = this.props;
    const { formVals } = this.state;
    const MenuNode = props => {
      return (
        <div className={styles.menuNode}>
          <div className="left">
            <Icon type="menu" />
            <span>{props.node.title}</span>
          </div>
          <div className="right" />
        </div>
      );
    };
    const loop = data =>
      data.map(item => {
        if (item.children && item.children.length) {
          return (
            <TreeNode key={item.key} title={<MenuNode node={item} />}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={<MenuNode node={item} />} />;
      });
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="编辑角色"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false, values)}
        okText="确定修改"
        onOk={this.okHandle}
        afterClose={() => handleUpdateModalVisible()}
        className={styles.modalContent}
        maskClosable={false}
      >
        <FormItem {...formItemLayout0515} label="角色名称">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入角色名称！' }],
            initialValue: formVals.name,
          })(<Input placeholder="请输入角色名称" />)}
        </FormItem>
        <FormItem {...formItemLayout0515} label="菜单权限">
          {form.getFieldDecorator('menus', {
            rules: [{ required: false, message: '请选择菜单权限！' }],
          })(
            <Tree
              className="draggable-tree"
              defaultExpandedKeys={this.state.expandedKeys}
              checkable
              onExpand={this.onExpand}
              expandedKeys={this.state.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
              onCheck={this.onCheck}
              checkedKeys={this.state.checkedKeys}
              onSelect={this.onSelect}
              selectedKeys={this.state.selectedKeys}
            >
              {loop(gData)}
            </Tree>
          )}
        </FormItem>
      </Modal>
    );
  }
}

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
class Role extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    checkModalVisible: false,
    deleteModalVisible: false,
    selectedRows: [],
    formValues: {},
    updateFormValues: {},
    gData: menuRouterData[1].routes,
  };

  columns = [
    {
      title: '序号',
      dataIndex: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'add_time',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record.id, 1)}>
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    let params = {
      _token: localStorage._token,
    };
    this.getMenuList();
    dispatch({
      type: 'role/fetch',
      payload: params,
    });
  }

  getMenuList = () => {
    const { dispatch } = this.props;
    const params = {
      _token: localStorage._token,
    };
    dispatch({
      type: 'role/getRoleMenuList',
      payload: params,
      callback: res => {
        if (res && res.status == 0) {
          this.setState({ gData: res.data });
        }
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({ selectedRows: rows });
  };

  handleSearch = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form, role } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        _token: localStorage._token,
      };

      this.setState({ formValues: values });

      dispatch({
        type: 'role/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({ modalVisible: !!flag });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      updateFormValues: record || {},
    });
  };
  handleDeleteModalVisible = (flag, record) => {
    this.setState({
      deleteModalVisible: !!flag,
      selectedRows: record || [],
    });
  };

  handleAdd = (fields, checkedIds) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/add',
      payload: {
        ...fields,
        menus: checkedIds.join(),
        _token: localStorage._token,
      },
      callback: res => {
        if (res && res.status == 0) {
          message.success('添加成功');
          this.handleModalVisible();
          this.handleSearch();
        }
      },
    });
  };

  handleUpdate = (fields, checkedIds, id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/update',
      payload: {
        id,
        ...fields,
        menus: isArray(checkedIds) ? checkedIds.join() : checkedIds,
        _token: localStorage._token,
      },
      callback: res => {
        if (res && res.status == 0) {
          message.success('修改成功');
          this.handleUpdateModalVisible();
          this.handleSearch();
        }
      },
    });
  };
  //删除
  handleDelete = (id, type) => {
    // type:1 单个删除 2批量删除
    const { dispatch } = this.props;
    dispatch({
      type: 'role/delete',
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

  render() {
    const {
      role: { data },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      updateFormValues,
      checkModalVisible,
      gData,
      deleteModalVisible,
    } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const deleteMethods = {
      handleDeleteModalVisible: this.handleDeleteModalVisible,
      handleDelete: this.handleDelete,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加
              </Button>
            </div>
            <Table
              rowKey={record => {
                return record.id;
              }}
              columns={this.columns}
              pagination={false}
              dataSource={data}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} gData={gData} modalVisible={modalVisible} />
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

export default Role;
