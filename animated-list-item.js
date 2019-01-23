import React from 'react';
import { Animated, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

class AnimatedListItem extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      height: new Animated.Value(0),
      opacity: new Animated.Value(0)
    };
  }

  componentDidMount() {
    Animated.sequence([
      Animated.timing(
        this.state.height,
        {
          toValue: this.props.height,
          duration: this.props.duration || 1000
        }
      ),
      Animated.timing(
        this.state.opacity,
        {
          toValue: 1,
          duration: this.props.duration || 1000
        }
      )
    ]).start();
  }

  reverAnimation = () => {
    Animated.sequence([
      Animated.timing(
        this.state.opacity,
        {
          toValue: 0,
          duration: this.props.duration || 1000
        }
      ),
      Animated.timing(
        this.state.height,
        {
          toValue: 0,
          duration: this.props.duration || 1000
        }
      )
    ]).start(() => {
      console.log('reverse animation stoped...');
    });
  }

  render() {
    const { height, opacity } = this.state;
    return (
      <Animated.View
        style={{
          ...this.props.style,
          height: height,
          opacity: opacity
        }}
      >
        <TouchableWithoutFeedback style={{flex: 1}} onPress={this.reverAnimation}>
          {this.props.children}
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

export default AnimatedListItem;
