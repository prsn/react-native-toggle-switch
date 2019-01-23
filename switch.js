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
  }

  toggleSwitch = () => {
    this.setState(({ isActive }) => ({
      isActive: !isActive
    }));
  }

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
    return (
      <TouchableWithoutFeedback onPress={this.toggleSwitch}>
        <View style={[styles.viewPort, { width: viewWidth }, { backgroundColor: isActive ? active : inactive }]} onLayout={ this.setViewPortWidth }>
          <View style={[styles.container, {left, width: Math.max(width.left, width.right) * 2 + width.indicator + 16 }]}>
            <View style={[styles.onText, { flex: on.length > off.length ? 0 : 1 }]} onLayout={ this.setLeftWidth }>
              <Text style={{alignSelf: 'center'}}>
                {on}
              </Text>
            </View>
            <View style={[styles.indicator, { backgroundColor: indicator }]}/>
            <View style={[styles.offText, { flex: on.length > off.length ? 1 : 0 }]} onLayout={ this.SetRightWidth }>
              <Text style={{alignSelf: 'center'}}>
                {off}
              </Text>
            </View>
          </View>
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
