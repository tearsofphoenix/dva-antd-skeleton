/* global window */
import axios from 'axios'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message, notification } from 'antd'

export const fetch = (options) => {

  let {
    method = 'get',
    data,
    url
  } = options
  const cloneData = lodash.cloneDeep(data)
  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    message.error(e.message)
  }
  // 创建axios实例
  let instance = axios.create({
    baseURL: '/api'
  });
  switch (method.toLowerCase()) {
    case 'get':
      return instance.get(url, {
        params: cloneData
      })
    case 'delete':
      return instance.delete(url, {
        data: cloneData
      })
    case 'post':
      return instance.post(url, cloneData)
    case 'put':
      return instance.put(url, cloneData)
    case 'patch':
      return instance.patch(url, cloneData)
    default:
      return instance(options)
  }
}

export default function (options) {

  return fetch(options).then((response) => {
    const { statusText, status } = response
    const { data } = response
    console.log(61, data)
    const { code } = data
    if (code === 3000) {
      // 会话过期, 跳转登录
      notification.open({
        message: '提示',
        description: '会话已过期,请重新登录',
        style: { color: '#fff', backgroundColor: '#f3b304' },
        duration: 3,
        onClose: () => {
          window.location = '#/user/login';
        }
      })
    } else {
      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...data
      })
    }
  }).catch((error) => {
    const { response } = error
    console.log(74, response)
    if (response && response.code === 3000) {
      // 会话过期, 跳转登录
      notification.open({
        message: '提示',
        description: '会话已过期,请重新登录',
        style: { color: '#fff', backgroundColor: '#f3b304' },
        duration: 3,
        onClose: () => {
          window.location = '#/user/login';
        }
      });
    }
    return Promise.reject({ success: false, statusCode: response.code, message: response.message })
  })
}
