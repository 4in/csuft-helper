import Taro, {Component} from '@tarojs/taro';
import {Checkbox, View} from '@tarojs/components';
import NoData from '../../../components/NoData';
import Timetable from '../../../components/Timetable';
import MLoading from '../../../components/MLoading';
import MModal from '../../../components/MModal';
import {$Loading} from '../../../components/Base';
import request from '../../../utils/request';
import {showModal} from '../../../utils/utils';
import './index.scss';

class Cet extends Component {
  config = {
    navigationBarTitleText: '学期课表',
    enablePullDownRefresh: true,
  };
  state = {
    timetable: [],
    note: '',
    week: 0,
    term_start: 0,

    specific: true,
    modal_visible: false,
    cur_courses: []
  };

  onShareAppMessage(obj) {
    return {
      title: '学期课表',
      path: '/pages/index/index',
    };
  }

  componentDidMount() {
    if (Taro.getStorageSync('cookies') === '') {
      Taro.redirectTo({
        url: '/pages/index/index'
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
      const res = await request.get(`/jiaowu/timetable`);
      if (res.code === 0) {
        this.setState({timetable: res.data.sections, note: res.data.note, term_start: res.term_start}, () => {
          this.setState({
            specific: true,
            week: this.getCurrentWeek()
          });
        });
      } else {
        throw new Error(res.msg);
      }
    } catch (e) {
      showModal(e.message || e.errMsg);
    }
    $Loading.hide();
  };

  handleSpecificChange = () => {
    let spec = this.state.specific;
    this.setState({
      specific: !spec,
      week: spec ? 0 : this.getCurrentWeek()
    });
  };

  getCurrentWeek = () => {
    const {term_start} = this.state;
    let timeStamp = new Date() / 1000;
    let diff = timeStamp - term_start;
    return Math.ceil(diff / 86400 / 7);
  };

  handlePageChange = (diff) => {
    console.log(diff);
    const {week} = this.state;
    if (week + diff < 0) return;
    this.setState({week: week + diff});
  };

  handleShowCourses = (courses) => {
    if (courses.length === 0) return;
    this.setState({modal_visible: true, cur_courses: courses});
  };

  handleOk = () => {
    this.setState({modal_visible: false});
  };

  render() {
    const {timetable, week, note, specific, modal_visible, cur_courses} = this.state;
    return (
      <View>
        <MLoading id='loading'/>
        <View>
          {
            timetable.length > 0 ?
              <View className='ctrl row'>
                <View className='col-5'>
                  <Checkbox checked={specific} onClick={this.handleSpecificChange}>指定周课表</Checkbox>
                </View>
                <View className='col-7 pager'>
                  <View className='btn' onClick={this.handlePageChange.bind(this, -1)}>◀︎</View>
                  <View>{`第 ${week} 周`}</View>
                  <View className='btn' onClick={this.handlePageChange.bind(this, 1)}>▶︎</View>
                </View>
              </View> : null
          }
          <Timetable data={timetable} week={week} onShow={this.handleShowCourses}/>
          <View className='note'>{note}</View>
          <MModal show={modal_visible} onOk={this.handleOk}>
            {
              cur_courses.map((c, i) => (
                <View key={i} className='modal_course'>
                  <View>课程：{c.title}</View>
                  <View>讲师：{c.teacher}</View>
                  <View>教室：{c.classroom}</View>
                  <View>周次：{c.weeks}</View>
                </View>
              ))
            }
          </MModal>
        </View>
        {
          timetable.length === 0 ?
            <NoData/> : null
        }
      </View>
    );
  }
}

export default Cet;