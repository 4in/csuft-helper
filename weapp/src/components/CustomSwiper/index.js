import Taro, {Component} from '@tarojs/taro'
import {Image, Swiper, SwiperItem, View} from '@tarojs/components'

import './index.scss'

class CustomSwiper extends Component {
  state = {
    current: 0
  };

  onBannerChange(e) {
    this.setState({
      current: e.detail.current
    })
  }

  onBannerClick(index) {
    const item = this.props.data[index];
    if (!item.page) return;
    Taro.navigateTo({
      url: item.page,
    });
  }

  render() {
    return (
      <View className='banners'>
        <Swiper onChange={this.onBannerChange} autoplay current={this.state.current}>
          {
            this.props.data.map((el, i) => (
              <SwiperItem key={i} onClick={this.onBannerClick.bind(this, i)}>
                <Image className='banner-image' mode='widthFix' src={el.image}/>
              </SwiperItem>
            ))
          }
        </Swiper>
        <View className='indicator-dots'>
          {
            this.props.data.map((el, i) => (
              <View className={this.state.current === i ? 'active' : ''} key={i}/>
            ))
          }
        </View>
      </View>
    );
  }
}

export default CustomSwiper;