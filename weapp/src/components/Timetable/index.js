import {Component} from '@tarojs/taro';
import {View} from '@tarojs/components';
import './index.scss';

class Timetable extends Component {

  handleShow = (courses) => {
    let {week = 0, onShow} = this.props;
    week = Number(week);
    if (typeof onShow !== 'function') return;
    let arg = week === 0 ? courses : courses.filter(v => v.w.indexOf(week) > -1);
    onShow(arg);
  };

  render() {
    let {data, week} = this.props;
    week = Number(week);
    return (
      <View>
        <View className='row head'>
          <View className='col copyright'>🌟</View>
          <View className='col'>周一</View>
          <View className='col'>周二</View>
          <View className='col'>周三</View>
          <View className='col'>周四</View>
          <View className='col'>周五</View>
          <View className='col'>周六</View>
          <View className='col'>周日</View>
        </View>
        {
          data.map((datum, i) => (
            <View className='row course' key={i}>
              <View className='col section'>{datum.title}</View>
              {
                datum.courses.map((clazz, j) => (
                  <View className='col' key={j} onClick={this.handleShow.bind(this, clazz)}>
                    {
                      week === 0 ?
                        clazz.map((c, u) => (
                          <View className='single' key={u}>{c.title}@{c.classroom}</View>
                        )) :
                        clazz.filter(v => v.w.indexOf(week) > -1).map((c, u) => (
                          <View className='single' key={u}>{c.title}@{c.classroom}</View>
                        ))
                    }
                  </View>
                ))
              }
            </View>
          ))
        }
      </View>
    );
  }
}

Timetable.defaultProps = {
  data: [],
  week: 0
};

export default Timetable;