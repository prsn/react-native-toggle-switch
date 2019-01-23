import React from 'react';
import {
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';

class AnimatedListItemWithNativeDriver extends React.Component {
  constructor(...props) {
    super(...props);
    this.transformY = new Animated.Value(0);
    this.opacity = new Animated.Value(1);

  }

  componentDidMount() {
    Animated.sequence([
      // Animated.timing(
      //   this.opacity,
      //   {
      //     toValue: 1,
      //     duration: this.props.duration || 1000
      //   }
      // ),
      Animated.timing(
        this.transformY, {
          toValue: 1,
          friction: 6,
          duration: this.props.duration * 3 || 1000
        }
      )
    ]).start(() => {
      console.log('animation stopped...');
    });
  }

  render() {
    // const { opacity } = this.state;
    const {
      height
    } = this.props;
    return ( 
      <Animated.View style = {
        {
          ...this.props.style,
          opacity: this.opacity,
          transform: [{
            translateY: this.transformY.interpolate({
              inputRange: [0, 1],
              outputRange: [height, 0]
            })
          }]
        }
      } >
      <TouchableWithoutFeedback style = {
        {
          flex: 1
        }
      } > {
        this.props.children
      } </TouchableWithoutFeedback> </Animated.View>
    );
  }
}

export default AnimatedListItemWithNativeDriver;