import React from 'react';
import PropTypes from 'prop-types';
import {Link, Route} from 'dva/router'
import DocumentTitle from 'react-document-title';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

class UserLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
  }

  getChildContext() {
    const {location} = this.props;
    return {location};
  }

  getPageTitle() {
    const {getRouteData, location} = this.props;
    const {pathname} = location;
    let title = 'Genesis';
    getRouteData('UserLayout').forEach((item) => {
      if (item.path === pathname && item.name) {
        title = `${item.name} - ${title}`;
      }
    });
    return title;
  }

  render() {
    const {getRouteData} = this.props;

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="" className={styles.logo} src={logo} />
                <span className={styles.title}>Genesis</span>
              </Link>
            </div>
            <div className={styles.desc}>...</div>
          </div>
          {
            getRouteData('UserLayout').map(item =>
              (
                <Route
                  exact={item.exact}
                  key={item.path}
                  path={item.path}
                  component={item.component}
                />
              )
            )
          }
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
