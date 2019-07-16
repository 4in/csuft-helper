import { Picker, View } from '@tarojs/components';
import Taro, { Component } from '@tarojs/taro';
import MButton from '../../../components/MButton';
import './index.scss';


let datasource_terms = [];
let datasource_attrs = [
  { key: '', text: '全部' },
  { key: '01', text: '公共课' },
  { key: '02', text: '公共基础课' },
  { key: '03', text: '专业基础课' },
  { key: '04', text: '专业课' },
  { key: '05', text: '专业选修课' },
  { key: '06', text: '公共选修课' },
  { key: '07', text: '专业限选课' },
  { key: '08', text: '其它' },
  { key: '09', text: '通识教育课程' },
  { key: '10', text: '学科基础课' },
  { key: '11', text: '实践教学' },
  { key: '13', text: '学科基础选修课' },
  { key: '14', text: '辅修' },
];
let datasource_disps = [{ key: 'all', text: '显示全部成绩' }, { key: 'max', text: '显示最好成绩' }];  // Display
const now = new Date();
for (let t = 2015; t <= now.getFullYear(); ++t) {
  datasource_terms.unshift(`${t}-${t + 1}-2`, `${t}-${t + 1}-1`);
}

class Scores extends Component {
  config = {
    navigationBarTitleText: '成绩查询',
    backgroundColor: '#f8f8f9',
  };

  state = {
    term: 0,
    attr: 0,
    disp: 0,
  };

  onShareAppMessage(obj) {
    return {
      title: '成绩查询',
      path: '/pages/index/index',
    };
  }

  handlePickerChange = (k, v) => {
    this.setState({ [k]: v.detail.value });
  };

  handleQuery = () => {
    const { term, attr, disp } = this.state;
    Taro.navigateTo({
      url: `/pages/modules/scores/detail?term=${datasource_terms[term]}&attr=${datasource_attrs[attr].key}&disp=${datasource_disps[disp].key}`,
    });
  };

  render() {
    const { term, attr, disp } = this.state;
    return (
      <View className='g-container'>
        <View className='form'>
          <View className='field'>
            <View className='title'>开课时间</View>
            <Picker mode='selector' value={term} range={datasource_terms}
                    onChange={this.handlePickerChange.bind(this, 'term')}>
              <View className='value'>{datasource_terms[term] || '请选择'}</View>
            </Picker>
          </View>
          <View className='field'>
            <View className='title'>课程性质</View>
            <Picker mode='selector' value={attr} range={datasource_attrs} range-key='text'
                    onChange={this.handlePickerChange.bind(this, 'attr')}>
              <View className='value'>{datasource_attrs[attr].text}</View>
            </Picker>
          </View>
          <View className='field'>
            <View className='title'>显示方式</View>
            <Picker mode='selector' value={disp} range={datasource_disps} range-key='text'
                    onChange={this.handlePickerChange.bind(this, 'disp')}>
              <View className='value'>{datasource_disps[disp].text}</View>
            </Picker>
          </View>
        </View>
        <View>
          <View className='btn-wrapper'>
            <MButton onClick={this.handleQuery}>查询</MButton>
          </View>
        </View>
      </View>
    );
  }
}

export default Scores;