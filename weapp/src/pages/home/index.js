import Taro, {Component} from '@tarojs/taro';
import {Image, View} from '@tarojs/components';
import CustomSwiper from '../../components/CustomSwiper';
import request from '../../utils/request';
import './index.scss';
import img_banner from '../../assets/banner.png';
import img_tower from '../../assets/tower.svg';

const default_modules = [
  {
    image: img_tower,
    title: '学期课表',
    page: '/pages/modules/timetable/index',
  }
];
class Home extends Component {
  state = {
    banners: [{image: img_banner}],
    modules: Taro.getStorageSync('modules') || default_modules
  };

  onShareAppMessage(obj) {
    return {
      path: '/pages/index/index',
    };
  }

  componentDidMount() {
    this.fetchModules();
  }

  fetchModules = () => {
    request.get('/modules').then(e => {
      if (e.code === 0) {
        Taro.setStorageSync('modules', e.data);
        this.setState({
          modules: e.data
        });
      }
    });
  };

  gotoModule = (path) => {
    if (!path) return;
    Taro.navigateTo({url: path});
  };

  render() {
    const {banners, modules} = this.state;
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
      </View>
    )
  }
}

export default Home;