import Taro from '@tarojs/taro';
export const showModal = text => {
  Taro.showModal({
    title: '提示',
    content: text || '未知错误',
    showCancel: false
  });
};