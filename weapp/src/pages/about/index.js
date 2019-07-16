import { Image, Text, View } from '@tarojs/components';
import { Component } from '@tarojs/taro';
import about_us from '../../assets/about-us.jpg';
import './index.scss';


export class About extends Component {
  config = {
    navigationBarTitleText: '关于'
  };
  render() {
    return (
      <View>
        <Image className='about-us' src={about_us} mode='widthFix'/>
        <View className='content'>
          <Text className='p'>「林科大助手」小程序旨在简化同学们的信息查询方式，方便同学们随时查询成绩、课表等信息。</Text>
          <Text className='p'>为了方便登录，小程序仅在**本地**保存账号密码，服务器不储存任何数据，删除小程序即可清除相关信息。</Text>
          <Text className='p'>本小程序已开源。开源地址：</Text>
          <Text className='p' selectable>https://github.com/marco-tan/csuft-helper</Text>
        </View>
      </View>
    );
  }
}