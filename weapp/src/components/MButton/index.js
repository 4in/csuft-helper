import PropTypes from 'prop-types';
import {Component} from '@tarojs/taro'
import {Button, View} from '@tarojs/components';
import './index.scss';


class MButton extends Component {
  render() {
    const {onClick} = this.props;
    return (
      <View className='wrapper'>
        {this.props.children}
        <Button className='btn' onClick={onClick}/>
      </View>
    );
  }
}

MButton.propTypes = {
  onClick: PropTypes.any
};

MButton.defaultProps = {
  onClick: () => {}
};
export default MButton;