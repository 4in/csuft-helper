import { Block, View } from '@tarojs/components';
import { Component } from '@tarojs/taro';
import PropTypes from 'prop-types';
import './index.scss';

class MModal extends Component {
  static externalClasses = ['m-class'];

  handleOk = () => {
    const { onOk } = this.props;
    typeof onOk === 'function' && onOk();
  };

  render() {
    const { show = false } = this.props;
    return (
      show ?
        <Block>
          <View className='mask'/>
          <View className='modal m-class'>
            <View className='content'>
              {this.props.children}
            </View>
            <View className='btn' onClick={this.handleOk}>
              确定
            </View>
          </View>
        </Block> : null
    );
  }
}

MModal.propTypes = {
  show: PropTypes.any,
  onOk: PropTypes.any,
};

MModal.defaultProps = {
  show: false,
};

export default MModal;