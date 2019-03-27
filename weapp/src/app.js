import '@tarojs/async-await';
import Taro, { Component } from '@tarojs/taro';
import Index from './pages/index';

import './app.scss';

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/home/index',
      'pages/modules/cet/index',
      'pages/modules/scores/index',
      'pages/modules/scores/detail',
      'pages/modules/timetable/index'
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '林科大助手',
      navigationBarTextStyle: 'black'
    }
  };

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
