import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Tabs } from 'antd';
import classNames from 'classnames';
import { formatMessage, FormattedMessage,setLocale ,getLocale } from 'umi/locale';
import styles from './index.less';
import LoginContext from './loginContext';

class UserLogin extends Component {
  static propTypes = {
    className: PropTypes.string,
    defaultActiveKey: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    defaultActiveKey: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
      tabs: [],
      active: {},
    };
  }

  onSwitch = type => {
    this.setState({
      type,
    });
    const { onTabChange } = this.props;
    onTabChange(type);
  };

  getContext = () => {
    const { tabs } = this.state;
    const { form } = this.props;
    return {
      tabUtil: {
        addTab: id => {
          this.setState({
            tabs: [...tabs, id],
          });
        },
        removeTab: id => {
          this.setState({
            tabs: tabs.filter(currentId => currentId !== id),
          });
        },
      },
      form,
      updateActive: activeItem => {
        const { type, active } = this.state;
        if (active[type]) {
          active[type].push(activeItem);
        } else {
          active[type] = [activeItem];
        }
        this.setState({
          active,
        });
      },
    };
  };


  render() {
    const { className, children } = this.props;
    React.Children.forEach(children, item => {
      if (!item) {
        return;
      }
    });
    return (
      <LoginContext.Provider value={this.getContext()}>
        <div className={classNames(className, styles.login)}>
        <FormattedMessage id="login" />
        </div>
        <div className={classNames(className, styles.loginTip)}>Click to login and connect to wallet</div>
      </LoginContext.Provider>
    );
  }
}

export default Form.create()(UserLogin);
