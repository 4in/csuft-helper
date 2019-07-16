import { View } from '@tarojs/components';
import Taro, { Component } from '@tarojs/taro';
import { $Loading } from '../../../components/Base';
import MLoading from '../../../components/MLoading';
import NoData from '../../../components/NoData';
import request from '../../../utils/request';
import { showModal } from '../../../utils/utils';
import './index.scss';

class Cet extends Component {
  config = {
    navigationBarTitleText: '等级考试成绩',
    enablePullDownRefresh: true,
    backgroundColor: '#f7f7f7',
  };
  state = {
    scores: [],
  };

  onShareAppMessage(obj) {
    return {
      title: '等级考试成绩',
      path: '/pages/index/index',
    };
  }

  componentDidMount() {
    if (Taro.getStorageSync('cookies') === '') {
      Taro.redirectTo({
        url: '/pages/index/index',
      });
      return;
    }
    this.fetchData();
  }

  onPullDownRefresh() {
    this.fetchData();
  }

  fetchData = async () => {
    $Loading({});
    try {
      const res = await request.get(`/jiaowu/cet`);
      if (res.code === 0) {
        this.setState({ scores: res.data });
      } else {
        throw new Error(res.msg);
      }
    } catch (e) {
      showModal(e.message || e.errMsg);
    }
    $Loading.hide();
  };

  render() {
    const { scores } = this.state;
    return (
      <View className='g-container'>
        <MLoading id='loading' m-class='white'/>
        <View>
          {
            scores.map(s => (
              <View key={s.id} className='score'>
                <View className='title'>{s.title}</View>
                {
                  (s.scores_written !== '' || s.scores_computer !== '' || s.scores_total !== '') ?
                    <View className='block'>
                      <View>等级类</View>
                      <View className='row'>
                        <View className='col-4'>笔试</View>
                        <View className='col-4'>机试</View>
                        <View className='col-4'>总成绩</View>
                      </View>
                      <View className='row'>
                        <View className='col-4'>{s.scores_written}</View>
                        <View className='col-4'>{s.scores_computer}</View>
                        <View className='col-4'>{s.scores_total}</View>
                      </View>
                    </View> : null
                }
                {
                  (s.grades_written !== '' || s.grades_computer !== '' || s.grades_total !== '') ?
                    <View className='block'>
                      <View>等级类</View>
                      <View className='row'>
                        <View className='col-4'>笔试</View>
                        <View className='col-4'>机试</View>
                        <View className='col-4'>总成绩</View>
                      </View>
                      <View className='row'>
                        <View className='col-4'>{s.grades_written}</View>
                        <View className='col-4'>{s.grades_computer}</View>
                        <View className='col-4'>{s.grades_total}</View>
                      </View>
                    </View> : null
                }
                <View className='footer'>考试时间：{s.date}</View>
              </View>
            ))
          }
        </View>
        {
          scores.length === 0 ?
            <NoData/> : null
        }
      </View>
    );
  }
}

export default Cet;