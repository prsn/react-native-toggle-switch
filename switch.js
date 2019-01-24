import React from 'react';
import { Animated, View, TouchableWithoutFeedback, StyleSheet, Text } from 'react-native';

class Switch extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      width: {
        left: 0,
        right: 0,
        indicator: HEIGHT,
        viewPort: 0
      },
      container: {
        left: this.props.active ? 0 : 0,
      },
      isActive: this.props.active || false
    };
    this.setLeftWidth = this.setWithValues('left');
    this.SetRightWidth = this.setWithValues('right');
    this.setViewPortWidth = this.setWithValues('viewPort');
    this.value = new Animated.Value(1);
    this.lastLeft = 0;
  }

  toggleSwitch = () => {
    this.animateSwitch(this.state.isActive, () => {
      this.setState(({ isActive }) => ({
        isActive: !isActive
      }));
    });
  }

  animateSwitch = (value, cb = () => {}) => {
    // this.value.setValue(0);
    Animated.timing(this.value, {
      toValue: value ? 1 : 0,
      duration: 1000
    }).start(cb); 
  };

  setWithValues = key => event => {
    const width = event.nativeEvent.layout.width;
    this.setState(prevState => ({
      width: {
        ...prevState.width,
        [key]: width
      }
    }))
  }

  render() {
    const { text: { on = 'ON', off = 'OFF' }, color: { active, inactive, indicator }} = this.props;
    const { width, isActive } = this.state;
    const left = isActive ? 0 : (width.left + 8) * -1;
    const viewWidth = Math.max(width.left, width.right) + width.indicator + 16;
    
    const visibleToInvisible = this.value.interpolate({
      inputRange:[0, 1],
      outputRange: [1, 0]
    });

    const invisibleToVisible = this.value.interpolate({
      inputRange:[0, 1],
      outputRange: [0, 1]
    });

    const animatedOpacity = this.value.interpolate({
      inputRange:[0, 1],
      outputRange: isActive? [0, 1] : [1, 0]
    });
    const translateX = this.value.interpolate({
      inputRange: [0, 1],
      outputRange: !isActive? [this.lastLeft, left] : [left, this.lastLeft]
    });
    console.log(isActive, left, this.lastLeft);
    this.lastLeft = left;
    return (
      <TouchableWithoutFeedback onPress={this.toggleSwitch}>
        <View style={[styles.viewPort, { width: viewWidth }]} onLayout={ this.setViewPortWidth }>
          <Animated.View style={[styles.container, { transform: [{ translateX: translateX }]}, { width: Math.max(width.left, width.right) * 2 + width.indicator + 16 }]}>
            <Animated.View style={[{ opacity: isActive ? invisibleToVisible : visibleToInvisible }, { backgroundColor: isActive ? active : inactive }]}>
              <Animated.View style={[styles.onText, { flex: on.length > off.length ? 0 : 1 }, {opacity: isActive ? invisibleToVisible : visibleToInvisible}]} onLayout={ this.setLeftWidth }>
                <Text style={{alignSelf: 'center'}}>
                  {on}
                </Text>
              </Animated.View>
            </Animated.View>
            <View style={[styles.indicator, { backgroundColor: indicator }]}/>
            <Animated.View style={[styles.offText, { flex: on.length > off.length ? 1 : 0 }, {opacity: isActive ? invisibleToVisible : visibleToInvisible}]} onLayout={ this.SetRightWidth }>
              <Text style={{alignSelf: 'center'}}>
                {off}
              </Text>
            </Animated.View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
const HEIGHT = 24;
const styles = StyleSheet.create({
  viewPort: {
    overflow: 'hidden',
    borderColor: 'black',
    borderRadius: HEIGHT / 2,
    borderWidth: 1,
    paddingTop: 2,
    paddingBottom: 2
  },
  container: {
    position: 'relative',
    left: 0,
    height: HEIGHT,
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  indicator: {
    width: HEIGHT,
    height: HEIGHT,
    borderRadius: HEIGHT / 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  onText: {
    marginRight: 5,
    marginLeft: 3
  },
  offText: {
    marginLeft: 5,
    marginRight: 3
  }
});

export default Switch;
