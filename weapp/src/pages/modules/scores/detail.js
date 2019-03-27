import {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import NoData from '../../../components/NoData';
import MLoading from '../../../components/MLoading';
import {$Loading} from '../../../components/Base';
import request from '../../../utils/request';
import {showModal} from '../../../utils/utils';
import './detail.scss';

class Detail extends Component {
  config = {
    navigationBarTitleText: '查询结果',
    enablePullDownRefresh: true,
    backgroundColor: '#f7f7f7'
  };
  state = {
    term: '',
    attr: '',
    disp: '',
    scores: []
  };

  onShareAppMessage(obj) {
    return {
      title: '成绩查询',
      path: '/pages/index/index',
    };
  }

  componentDidMount() {
    this.setState({
      ...this.$router.params
    }, () => {
      this.fetchData();
    });
  }

  onPullDownRefresh() {
    this.fetchData();
  }

  fetchData = async () => {
    const {term, attr, disp} = this.state;
    $Loading({});
    try {
      const res = await request.get(`/jiaowu/scores?term=${term}&attr=${attr}&disp=${disp}`);
      $Loading.hide();
      if (res.code === 0) {
        this.setState({scores: res.data});
      } else {
        showModal(res.msg);
      }
    } catch (e) {
      $Loading.hide();
      showModal(e.message || e.errMsg);
    }
  };

  render() {
    const {scores} = this.state;
    return (
      <View className='g-container'>
        <MLoading id='loading' m-class='white'/>
        <View>
          {
            scores.map(s => (
              <View key={s.order} className='card'>
                <View className='title'>{s.order}.<Text selectable>{s.title}</Text><Text className='id' selectable>({s.id})</Text></View>
                <View className='data'>
                  <View className='row field'>
                    <View className='col-3'>成绩</View>
                    <View className='col-3'>学分</View>
                    <View className='col-3'>学时</View>
                    <View className='col-3'>绩点</View>
                  </View>
                  <View className='row'>
                    <View className='col-3'>{s.score}</View>
                    <View className='col-3'>{s.credit}</View>
                    <View className='col-3'>{s.period}</View>
                    <View className='col-3'>{s.gpa}</View>
                  </View>
                </View>
                <View className='footer'>
                  <View className='row'>
                    <View className='col-6'>考核方式：{s.method}</View>
                    <View className='col-6'>考试性质：{s.property_exam}</View>
                    <View className='col-6'>课程属性：{s.attr}</View>
                    <View className='col-6'>课程性质：{s.property_course}</View>
                  </View>
                </View>
              </View>
            ))
          }
        </View>
        <View className='blank'/>
        {
          scores.length === 0 ? <NoData/> : null
        }
      </View>
    );
  }
}

export default Detail;