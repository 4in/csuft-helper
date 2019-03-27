import {Component} from '@tarojs/taro';
import {View, Image} from '@tarojs/components';
import './index.scss';
import img_nodata from '../../assets/no-data.png';

class NoData extends Component {
  render() {
    return (
      <View className='wrapper'>
        <View className='title'>暂无数据</View>
        <View className='sub'>页面暂无数据，请下拉刷新</View>
        <Image className='img' src={img_nodata} mode='widthFix'/>
      </View>
    )
  }
}

export default NoData;