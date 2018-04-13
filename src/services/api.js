import request from '../utils/request'

export async function accountLogin(params) {
  return request({
    url: '/user/login',
    method: 'POST',
    data: params,
  });
}
