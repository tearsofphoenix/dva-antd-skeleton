import React, { PureComponent } from 'react';
import { Link } from 'dva/router'
import PageHeader from '../components/PageHeader';
import styles from './PageHeaderLayout.less';

export default
class PageHeaderLayout extends PureComponent {
  render() {
    const { children, wrapperClassName, top, ...restProps } = this.props
    return (
      <div style={ { margin: '-24px -24px 0' } } className={ wrapperClassName }>
        { top }
        <PageHeader { ...restProps } linkElement={ Link } />
        { children ? <div className={ styles.content }>{ children }</div> : null }
      </div>
    )
  }
}
