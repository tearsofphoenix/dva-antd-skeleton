import request from '../utils/request'

export async function accountLogin(params) {
  return request({
    url: '/user/login',
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  return request({
    url: '/api/register',
    method: 'POST',
    data: params,
  });
}

export async function queryNotices() {
  return request({
    url: '/api/notices',
    method: 'GET',
  })
}

export async function resetPassword(params) {
  return request({
    url: '/user/forceresetpassword',
    method: 'POST',
    data: params,
  });
}
