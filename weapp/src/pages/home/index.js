import { Image, View } from '@tarojs/components';
import Taro, { Component } from '@tarojs/taro';
import img_banner from '../../assets/banner.png';
import img_tower from '../../assets/tower.svg';
import CustomSwiper from '../../components/CustomSwiper';
import jinrishici from '../../libs/jinrishici';
import request from '../../utils/request';
import './index.scss';

const default_modules = [
  {
    image: img_tower,
    title: '学期课表',
    page: '/pages/modules/timetable/index',
  },
];

class Home extends Component {
  config = {
    enablePullDownRefresh: true,
  };
  state = {
    banners: [{ image: img_banner, path: '/pages/about/index' }],
    modules: Taro.getStorageSync('modules') || default_modules,
    poem: '',
  };

  onShareAppMessage(obj) {
    return {
      path: '/pages/index/index',
    };
  }

  componentDidMount() {
    this.fetchModules();
    this.fetchPoem();
  }

  onPullDownRefresh() {
    this.fetchPoem();
  }

  fetchModules = () => {
    request.get('/modules').then(e => {
      if (e.code === 0) {
        Taro.setStorageSync('modules', e.data);
        this.setState({
          modules: e.data,
        });
      }
    });
  };

  fetchPoem = () => {
    jinrishici(res => {
      Taro.stopPullDownRefresh();
      console.log(res);
      if (res.status === 'success') {
        this.setState({ poem: res.data.content });
      }
    });
  };

  gotoModule = (path) => {
    if (!path) return;
    Taro.navigateTo({ url: path });
  };

  render() {
    const { banners, modules, poem } = this.state;
    return (
      <View>
        <CustomSwiper data={banners}/>
        <View className='modules row no-gutters'>
          {
            modules.map((m, i) => (
              <View key={i} className='module col-4' onClick={this.gotoModule.bind(this, m.page)}>
                <View><Image className='img' src={m.image}/></View>
                <View>{m.title}</View>
              </View>
            ))
          }
        </View>
        <View className='poem'>{poem}</View>
      </View>
    );
  }
}

export default Home;