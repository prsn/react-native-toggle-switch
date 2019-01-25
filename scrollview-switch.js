import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

class ScrollSwitch extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      width: {
        left: 64,
        right: 64,
        indicator: INDICATOR_HEIGHT,
        viewPort: 130
      },
      height: {
        left: 17,
        right: 17,
        indicator: INDICATOR_HEIGHT,
        viewPort: 40
      },
      container: {
        left: this.props.active ? 0 : 0,
      },
      isActive: this.props.active || false
    };
    this.initailContentOffset = this.props.active ? 0 : 65 + HEIGHT / 2 + 3
    this.setLeftWidth = () => {};//this.setDimensionValues('left');
    this.SetRightWidth = () => {}; //this.setDimensionValues('right');
    this.setViewPortWidth = () => {};//this.setDimensionValues('viewPort');
  }

  async componentDidMount() {
    if (!this.props.active) {
      setTimeout(() => {
        // this.scrollRef.scrollToEnd({ animated: false });
      }, 500);
      // this.toggleSwitch();
    }
  }

  toggleActive = (active) => {
    this.setState(({isActive}) => ({
      isActive: active === undefined? !isActive : active
    }), () => {
      this.props.onValueChange(active === undefined? this.state.isActive : active);
    });
  }

  toggleSwitch = () => {
    const { isActive } = this.state;
    if (isActive) {
      this.scrollRef.scrollToEnd();
      this.toggleActive(false);
    } else {
      this.scrollRef.scrollTo({x: 0, y: 0, animated: true})
      this.toggleActive(true);
    }
  }

  animateSwitch = (value, cb = () => {}) => {
    // this.value.setValue(0);
    // Animated.timing(this.value, {
    //   toValue: value ? 1 : 0,
    //   duration: 1000
    // }).start(cb); 
  };

  setDimensionValues = key => event => {
    const {width, height} = event.nativeEvent.layout;
    this.setState(prevState => ({
      width: {
        ...prevState.width,
        [key]: width
      },
      height: {
        ...prevState.height,
        [key]: height
      }
    }))
  }

  onDragEnd = (e) => {
    const { contentOffset } = e.nativeEvent;
    const { width: { left, indicator }, isActive } = this.state;
    console.log(e.nativeEvent, contentOffset, left)
    if(contentOffset.x > left / 2) {
      this.scrollRef.scrollToEnd();
      this.toggleActive(false);
    } else {
      this.scrollRef.scrollTo({x: 0, y: 0, animated: true})
      this.toggleActive(true);
    }
    this.touchableOpacity.setOpacityTo(1,300);
  }

  onDragStart = (e) => {
    this.touchableOpacity.setOpacityTo(0.5,300);
  }

  render() {
    const { text: { on = 'ON', off = 'OFF', activeTextColor, inactiveTextColor },
     color: { active, inactive, indicator, activeBorder, inactiveBorder }, 
     textStyle = {},
     disabled = false
    } = this.props;
    const { width, isActive, opacity, height: { viewPort: viewPortHeight } } = this.state;
    const left = isActive ? 0 : (width.left + 8) * -1;
    console.log(this.state);
    const viewPortWidth = Math.max(width.left, width.right) + width.indicator + 10 + viewPortHeight / 2 + 3;
    
    return (
      <TouchableOpacity  onPress={this.toggleSwitch} activeOpacity={1} ref = {ref => this.touchableOpacity = ref} disabled={disabled}>
      <View
        style={[
          styles.viewPort,
          { 
            width: viewPortWidth,
            // backgroundColor: 'transparent',
            opacity: 1,
            // borderColor: 'rgba(0,0,0,0.5)',
            borderRadius: viewPortHeight / 2,
            borderWidth: 2,
            borderColor: isActive ? activeBorder : inactiveBorder,
            backgroundColor: isActive? active: inactive
          }
        ]}
        onLayout={ this.setViewPortWidth }>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={r => this.scrollRef = r}
          onScrollEndDrag={this.onDragEnd}
          onScrollBeginDrag={this.onDragStart}
          style={{ flexGrow: 1}}
          scrollEnabled={!disabled}
          scrollsToTop={false}
          contentOffset={{x: this.initailContentOffset, y: 0}}
        >
          <View
            style={[
              styles.container,
              { opacity, width: Math.max(width.left, width.right) * 2 + INDICATOR_HEIGHT + 5 + 10 + HEIGHT },
              { backgroundColor: isActive? active: inactive },
              
            ]}
          >
            <View
              style={[
                styles.activeView,
                { flex: on.length > off.length ? 0 : 1 }
              ]}
              onLayout={ this.setLeftWidth }
            >
              <Text 
                style={[{alignSelf: 'center', 
                flexGrow: on.length > off.length ? 0 : 1, 
                textAlign: 'center',
                color: isActive ? activeTextColor : inactiveTextColor
                }, textStyle]}
              >
                {on}
              </Text>
            </View>
            <TouchableWithoutFeedback onPress={this.toggleSwitch} disabled={disabled}>
              <View style={[styles.indicatorWrapper,  {justifyContent: isActive ? 'flex-end' : 'flex-start'}]}>
                <View
                  style={[
                    styles.indicator,
                    { backgroundColor: indicator, borderColor: isActive ? active : inactive }
                  ]}
                />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={[
                styles.inactiveView,
                { flex: on.length > off.length ? 1 : 0 }
              ]}
              onLayout={ this.SetRightWidth }
            >
              <Text style={[{ alignSelf: 'center', 
              flexGrow: on.length > off.length ? 1 : 0,
               textAlign: 'center',
               color: isActive ? activeTextColor : inactiveTextColor
               }, textStyle]}>
                {off}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
      </TouchableOpacity>
    );
  }
}

const HEIGHT = 36;
const INDICATOR_HEIGHT = 32;
const styles = StyleSheet.create({
  viewPort: {
    paddingTop: 0,
    paddingBottom: 0,
    borderWidth: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden'
  },
  container: {
    position: 'relative',
    height: HEIGHT,
    padding: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  indicatorWrapper:{
    width: INDICATOR_HEIGHT + 5,
    height: INDICATOR_HEIGHT + 5,
    borderRadius: (INDICATOR_HEIGHT + 5) / 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  indicator: {
    width: INDICATOR_HEIGHT,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_HEIGHT / 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  activeView: {
    marginRight: 5,
    marginLeft: HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inactiveView: {
    marginLeft: 5,
    marginRight: HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default ScrollSwitch;
