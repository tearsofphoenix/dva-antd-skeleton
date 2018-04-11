import request from '../utils/request';

export async function query() {
  return request({
    url: '/user/list',
    method: 'GET'
  })
}

export async function userLogout() {
  return request({
    url: '/user/logout',
    method: 'POST'
  })
}

export async function createUser(data) {
  return request({
    url: '/user/create',
    method: 'POST',
    data
  })
}

export async function accountLogin(data) {
  return request({
    url: '/user/login',
    method: 'POST',
    data,
  });
}

export async function getOne(data) {
  return request({
    url: '/user/one',
    method: 'GET',
    data,
  });
}
