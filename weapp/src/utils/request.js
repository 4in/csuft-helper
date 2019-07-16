import Taro from '@tarojs/taro';
import { BASE_URL } from './config';

const request = (method, uri, params) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      method,
      url: BASE_URL + uri,
      data: params,
      dataType: 'json',
      header: {
        'Content-Type': 'application/json',
        'cookies': Taro.getStorageSync('cookies'),
      },
      success(res) {
        console.log(res);
        if (res.data.code === 401) {
          Taro.redirectTo({
            url: '/pages/index/index',
          });
        }
        resolve(res.data);
      },
      fail(res) {
        reject(res);
      },
      complete() {
        Taro.hideLoading();
        Taro.stopPullDownRefresh();
      },
    });
  });
};
const requests = {
  get(uri) {
    return request('GET', uri, {});
  },
  post(uri, params = null) {
    return request('POST', uri, params);
  },
  put(uri, params = null) {
    return request('PUT', uri, params);
  },
  delete(uri, params = null) {
    return request('DELETE', uri, params);
  },
};

export default requests;