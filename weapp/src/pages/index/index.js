import Taro, {Component} from '@tarojs/taro';
import {Block, Image, Input, Text, View} from '@tarojs/components';
import MButton from '../../components/MButton';
import {$Loading} from '../../components/Base';
import MModal from '../../components/MModal';
import MLoading from '../../components/MLoading';
import request from '../../utils/request';
import {showModal} from '../../utils/utils';
import './index.scss';
import logo from '../../assets/logo.png';
import plant from '../../assets/plant.png';


export default class Index extends Component {
  config = {
    disableScroll: true
  };

  state = {
    username: Taro.getStorageSync('username') || '',
    password: Taro.getStorageSync('password') || '',
    captcha: '',
    captcha_show: false,
    captcha_data: '',
    captcha_params: '',
    captcha_cookies: '',
    modal_visible: false
  };

  onShareAppMessage(obj) {
    return {
      path: '/pages/index/index',
    };
  }

  onInput = (k, v) => {
    this.setState({[k]: v.detail.value});
  };

  login = () => {
    const {username, password, captcha, captcha_show} = this.state;
    Taro.setStorageSync('username', username);
    Taro.setStorageSync('password', password);
    if (captcha_show) {
      this.login2();
      return;
    }
    $Loading({text: '正在登录'});
    request.post('/jiaowu/login', {
      username,
      password,
      captcha
    }).then(e => {
      $Loading.hide();
      if (e.code === 0) {
        Taro.setStorageSync('name', e.name);
        Taro.setStorageSync('cookies', e.cookies);
        Taro.redirectTo({
          url: '/pages/home/index'
        });
      } else if (e.code === 1) {
        this.setState({
          captcha_show: true,
          captcha_data: e.captcha,
          captcha_cookies: e.cookies,
          captcha_params: e.lt
        });
      } else {
        throw new Error(e.msg);
      }
    }).catch(e => {
      $Loading.hide();
      this.setState({captcha_show: false});
      showModal(e.message || e.errMsg);
    });
  };

  refreshCaptcha = () => {
    const {captcha_cookies} = this.state;
    $Loading({text: '刷新中'});
    request.get(`/jiaowu/captcha?cookies=${encodeURIComponent(captcha_cookies)}`).then(e => {
      $Loading.hide();
      if (e.code === 0) {
        this.setState({captcha_data: e.captcha});
      } else {
        throw new Error(e.msg);
      }
    }).catch(e => {
      $Loading.hide();
      showModal(e.message || e.errMsg);
    });
  };

  login2 = () => {
    const {username, password, captcha, captcha_params, captcha_cookies} = this.state;
    $Loading({text: '正在登录'});
    request.post('/jiaowu/login2', {
      username,
      password,
      captcha,
      params: captcha_params,
      cookies: captcha_cookies
    }).then(e => {
      $Loading.hide();
      if (e.code === 0) {
        Taro.setStorageSync('name', e.name);
        Taro.setStorageSync('cookies', e.cookies);
        Taro.redirectTo({
          url: '/pages/home/index'
        });
      } else {
        throw new Error(e.msg);
      }
    }).catch(e => {
      $Loading.hide();
      this.setState({captcha_show: false});
      showModal(e.message || e.errMsg);
    });
  };

  handleModal = (visible) => {
    this.setState({modal_visible: visible});
  };

  render() {
    const {username, password, captcha, captcha_show, captcha_data, modal_visible} = this.state;
    return (
      <View className='g-container'>
        <MLoading id='loading'/>
        <MModal show={modal_visible} onOk={this.handleModal.bind(this, false)}>
          <View>本小程序仅作为查询工具，所有数据均保存在本地，服务器不会储存您的密码，请妥善保存。</View>
        </MModal>
        <View className='form'>
          <Image className='logo' src={logo}/>
          <Text className='welcome color-content'>欢迎登录</Text>
          <Block>
            <Input className='g-input' value={username} placeholder='请输入学号' type='number' maxLength={8}
                   onInput={this.onInput.bind(this, 'username')}/>
            <Input className='g-input' value={password} placeholder='请输入密码' type='password' maxLength={32}
                   onInput={this.onInput.bind(this, 'password')}/>
            {
              captcha_show ?
                <Block>
                  <Image className='captcha' src={captcha_data} onClick={this.refreshCaptcha}/>
                  <Input className='g-input' value={captcha} placeholder='请输入验证码' type='text' maxLength={4}
                         onInput={this.onInput.bind(this, 'captcha')}/>
                </Block> : null
            }
            <View className='btn-wrapper'>
              <MButton onClick={this.login}>登录</MButton>
            </View>
          </Block>
        </View>
        <View className='plant'>
          <Image src={plant} mode='widthFix'/>
        </View>
        <View className='term' onClick={this.handleModal.bind(this, true)}>服务条款</View>
      </View>
    );
  }
}