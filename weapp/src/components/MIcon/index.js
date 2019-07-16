import { View } from '@tarojs/components';
import { Component } from '@tarojs/taro';
import PropTypes from 'prop-types';
import './index.scss';

class MIcon extends Component {
  static externalClasses = ['m-class'];

  handleClick = (e) => {
    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      e.stopPropagation();
      onClick();
    }
  };

  render() {
    const { type, spin, size, color } = this.props;
    return (
      <View className={`m-class iconfont ${type === '' ? '' : 'icon-' + type} ${spin ? 'spin' : ''}`}
            style={{ fontSize: size + 'rpx', color }} onClick={this.handleClick}/>
    );
  }
}

MIcon.propTypes = {
  type: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  spin: PropTypes.bool,
};
MIcon.defaultProps = {
  type: '',
  size: 28,
  color: '',
  spin: false,
};

export default MIcon;