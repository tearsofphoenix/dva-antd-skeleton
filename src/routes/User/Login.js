import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Icon, Checkbox, Alert } from 'antd';
import styles from './Login.less';
import CryptoJS from 'crypto-js'
const FormItem = Form.Item;

@connect()
@Form.create()
export default class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true },
      (err, values) => {
        const sha1 = CryptoJS.SHA1;
        values.password = sha1(values.password).toString().toUpperCase();
        if (!err) {
          this.props.dispatch({
            type: `user/login`,
            payload: {
              ...values,
              callback: () => {
                this.props.dispatch(routerRedux.push('/dashboard/main'));
              }
            },
          });
        }
      }
    );
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
              <FormItem>
                {getFieldDecorator('email', {
                  rules: [{
                    required: true, message: '请输入手机号/邮箱!',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="user" className={styles.prefixIcon} />}
                    placeholder="手机号/邮箱"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{
                    required: true, message: '请输入密码！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="lock" className={styles.prefixIcon} />}
                    type="password"
                    placeholder="输入密码"
                  />
                )}
              </FormItem>

          <FormItem className={styles.additional}>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox className={styles.autoLogin}>自动登录</Checkbox>
            )}
            <a className={styles.forgot} href="javascript:;">忘记密码</a>
            <Button size="large" className={styles.submit} type="primary" htmlType="submit">
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
