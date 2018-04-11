import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Avatar, Dropdown, Tag, message, Spin } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Link, Route, Redirect, Switch } from 'dva/router';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Debounce from 'lodash-decorators/debounce';
import HeaderSearch from '../components/HeaderSearch';
import GlobalFooter from '../components/GlobalFooter';
import NotFound from '../routes/Exception/404';
import styles from './BasicLayout.less';
import logo from '../assets/logo.svg';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const kSystems = ['Genesis', '金融系统']

const query = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200
  }
};

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object
  }

  constructor(props) {
    super(props);
    // 把一级 Layout 的 children 作为菜单项
    let menus = props.navData.reduce((arr, current) => arr.concat(current.children), []);
    menus = menus.filter(looper => !looper.hide);
    this.menus = menus;
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props)
    };
  }

  getChildContext() {
    const { location, navData, getRouteData } = this.props;
    const routeData = getRouteData('BasicLayout');
    const firstMenuData = navData.reduce((arr, current) => arr.concat(current.children), []);
    const menuData = this.getMenuData(firstMenuData, '');
    const breadcrumbNameMap = {};

    routeData.concat(menuData).forEach((item) => {
      breadcrumbNameMap[item.path] = {
        name: item.name,
        component: item.component
      };
    });
    return { location, breadcrumbNameMap };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent'
    });
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed
    });
  }
  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'user/logout'
      });
    }
  }
  onSystemMenuClick = ({ key }) => {
    this.props.dispatch({
      type: 'global/changeCurrentSystem',
      payload: parseInt(key, 10)
    })
  }
  getMenuData = (data, parentPath) => {
    let arr = [];
    data.forEach((item) => {
      if (item.children) {
        arr.push({ path: `${parentPath}/${item.path}`, name: item.name });
        arr = arr.concat(this.getMenuData(item.children, `${parentPath}/${item.path}`));
      }
    });
    return arr;
  }

  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
    currentMenuSelectedKeys.splice(-1, 1);
    if (currentMenuSelectedKeys.length === 0) {
      return ['dashboard'];
    }
    return currentMenuSelectedKeys;
  }

  getCurrentMenuSelectedKeys(props) {
    const { location: { pathname } } = props || this.props;
    const keys = pathname.split('/').slice(1);
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key];
    }
    return keys;
  }

  getNavMenuItems(menusData, parentPath = '') {
    if (!menusData) {
      return [];
    }
    const { global: { currentSystem } } = this.props
    return menusData.map((item) => {
      if (!item.name) {
        return null;
      }
      const { sys } = item
      if (sys && !sys.includes(currentSystem)) {
        return null
      }

      let itemPath;
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (item.children && item.children.some(child => child.name)) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={ item.icon } />
                  <span>{ item.name }</span>
                </span>
              ) : item.name
            }
            key={ item.key || item.path }
          >
            { this.getNavMenuItems(item.children, itemPath) }
          </SubMenu>
        );
      }
      const icon = item.icon && <Icon type={ item.icon } />;
      return (
        <Menu.Item key={ item.key || item.path }>
          {
            /^https?:\/\//.test(itemPath) ? (
              <a href={ itemPath } target={ item.target }>
                { icon }<span>{ item.name }</span>
              </a>
            ) : (
              <Link
                to={ itemPath }
                target={ item.target }
                replace={ itemPath === this.props.location.pathname }
              >
                { icon }<span>{ item.name }</span>
              </Link>
            )
          }
        </Menu.Item>
      );
    });
  }

  getPageTitle() {
    const { location, getRouteData } = this.props;
    const { pathname } = location;
    let title = 'Genesis';
    getRouteData('BasicLayout').forEach((item) => {
      if (item.path === pathname && item.name) {
        title = `${item.name} - ${title}`;
      }
    });
    return title;
  }

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold'
        })[newNotice.status];
        newNotice.extra = <Tag color={ color } style={ { marginRight: 0 } }>{ newNotice.extra }</Tag>;
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  handleOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const isMainMenu = this.menus.some(
      item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
    );
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys]
    });
  }
  toggle = () => {
    const { collapsed } = this.props;
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed
    });
    this.triggerResizeEvent();
  }

  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type
    });
  }
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices'
      });
    }
  }

  render() {
    const { currentUser, collapsed, fetchingNotices, getRouteData, global } = this.props;
    let { user } = this.props
    if (!user) {
      if (localStorage.sc_admin_user) {
        user = JSON.parse(localStorage.sc_admin_user);
      } else {
        this.props.dispatch(routerRedux.push('/user/login'));
      }
    }
    console.log(287, user, currentUser)
    const menu = (
      <Menu className={ styles.menu } selectedKeys={ [] } onClick={ this.onMenuClick }>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />登出</Menu.Item>
      </Menu>
    );
    const kSystemMenu = (
      <Menu onClick={ this.onSystemMenuClick }>
        { kSystems.map((l, idx) => <Menu.Item key={ idx }>{ l }</Menu.Item>) }
      </Menu>
    );
    const noticeData = this.getNoticeData();

    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : {
      openKeys: this.state.openKeys
    };

    const kSystemStyle = {
      marginLeft: '6px',
      color: 'white'
    }

    const layout = (
      <Layout>
        <Sider
          trigger={ null }
          collapsible
          collapsed={ collapsed }
          breakpoint="md"
          onCollapse={ this.onCollapse }
          width={ 160 }
          className={ styles.sider }
        >
          <div className={ styles.logo }>
            <Link to="/">
              <img alt="logo" src={ logo } />
              <Dropdown overlay={ kSystemMenu } trigger={ ['click'] }>
                <span style={ kSystemStyle }>
                  { kSystems[global.currentSystem] } <Icon type="down" />
                </span>
              </Dropdown>
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            { ...menuProps }
            onOpenChange={ this.handleOpenChange }
            selectedKeys={ this.getCurrentMenuSelectedKeys() }
            style={ { margin: '16px 0', width: '100%' } }
          >
            { this.getNavMenuItems(this.menus) }
          </Menu>
        </Sider>
        <Layout>
          <Header className={ styles.header }>
            <Icon
              className={ styles.trigger }
              type={ collapsed ? 'menu-unfold' : 'menu-fold' }
              onClick={ this.toggle }
            />
            <div className={ styles.right }>
              <HeaderSearch
                className={ `${styles.action} ${styles.search}` }
                placeholder="站内搜索"
                dataSource={ ['搜索提示一', '搜索提示二', '搜索提示三'] }
                onSearch={ (value) => {
                  console.log('input', value); // eslint-disable-line
                } }
                onPressEnter={ (value) => {
                  console.log('enter', value); // eslint-disable-line
                } }
              />
              { user ? (
                <Dropdown overlay={ menu }>
                  <span className={ `${styles.action} ${styles.account}` }>
                    <Avatar size="small" className={ styles.avatar }
                            src={ user.avatar || require('../assets/user.png') } />
                    { user.name || 'admin' }
                  </span>
                </Dropdown>
              ) : <Spin size="small" style={ { marginLeft: 8 } } /> }
            </div>
          </Header>
          <Content style={ { margin: '24px 24px 0', height: '100%' } }>
            <div style={ { minHeight: 'calc(100vh - 260px)' } }>
              <Switch>
                {
                  getRouteData('BasicLayout').map(item =>
                    (
                      <Route
                        exact={ item.exact }
                        key={ item.path }
                        path={ item.path }
                        component={ item.component }
                      />
                    )
                  )
                }
                <Redirect exact from="/" to="/dashboard/analysis" />
                <Route component={ NotFound } />
              </Switch>
            </div>
            <GlobalFooter
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> 2018 Genesis
                </div>
              }
            />
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={ this.getPageTitle() }>
        <ContainerQuery query={ query }>
          { params => <div className={ classNames(params) }>{ layout }</div> }
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  currentUser: state.user.currentUser,
  collapsed: state.global.collapsed,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
  user: state.user.currentUser,
  global: state.global
}))(BasicLayout);
