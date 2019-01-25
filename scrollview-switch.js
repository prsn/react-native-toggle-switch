import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

class ScrollSwitch extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      width: {
        left: this.props.width
      },
      // container: {
      //   left: this.props.active ? 0 : 0,
      // },
      isActive: this.props.active || false
    };
    this.borderWidth = 2;
    this.wrapperIndicatorPadding = 2;
    this.textMargin = 5;
    this.outerRadius = (90/360) * 2 * 3.142 * this.props.radius;
    this.viewPortWidth = this.props.width + this.outerRadius + (2 * this.props.radius) + ( 2 * this.wrapperIndicatorPadding) + this.textMargin + this.borderWidth * 2;
    this.initailContentOffset = this.props.active ? 0 : this.props.width + this.outerRadius + this.textMargin;
    this.setLeftWidth = () => {};//this.setDimensionValues('left');
    this.SetRightWidth = () => {}; //this.setDimensionValues('right');
    this.setViewPortWidth = () => {};//this.setDimensionValues('viewPort');
  }

  async componentDidMount() {
    if (!this.props.active) {
      setTimeout(() => {
        this.scrollRef.scrollToEnd({ animated: false });
      }, 10);
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
    console.log(contentOffset.x);
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
    const { width, isActive, opacity  } = this.state;
    
    return (
      <TouchableOpacity  onPress={this.toggleSwitch} activeOpacity={1} ref = {ref => this.touchableOpacity = ref} disabled={disabled}>
      <View
        style={[
          styles.viewPort,
          { 
            width: this.viewPortWidth,
            height: this.props.radius * 2 +  this.wrapperIndicatorPadding * 2 + this.borderWidth * 2,
            opacity: 1,
            borderRadius: this.outerRadius,
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
              { opacity, height:  this.props.radius * 2 +  this.wrapperIndicatorPadding * 2 },
              { backgroundColor: isActive? active: inactive  },
              
            ]}
          >
            <View
              style={[
                styles.activeView,
                { 
                  width: this.props.width,
                  marginLeft: this.outerRadius
                }
              ]}
            >
              <Text 
                style={[{alignSelf: 'center', 
                textAlign: 'center',
                color: isActive ? activeTextColor : inactiveTextColor
                }, textStyle]}
              >
                {on}
              </Text>
            </View>
            <TouchableWithoutFeedback onPress={this.toggleSwitch} disabled={disabled}>
              <View style={[styles.indicatorWrapper, 
                 {justifyContent: isActive ? 'flex-end' : 'flex-start',
                 padding: this.wrapperIndicatorPadding 
                 }]}>
                <View
                  style={[
                    styles.indicator,
                    { backgroundColor: indicator, 
                      borderColor: isActive ? active : inactive,
                      width: this.props.radius * 2,
                      height: this.props.radius * 2,
                      borderRadius: this.props.radius
                    }
                  ]}
                />
              </View>
            </TouchableWithoutFeedback>
            <View
              style={[
                styles.inactiveView,
                { width: this.props.width, marginRight: this.outerRadius }
              ]}
            >
              <Text style={[{ alignSelf: 'center', 
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
    overflow: 'hidden',
    alignItems: 'center'
  },
  container: {
    position: 'relative',
    height: HEIGHT,
    padding: 0,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  indicatorWrapper:{
    // width: INDICATOR_HEIGHT + 5,
    // height: INDICATOR_HEIGHT + 5,
    // borderRadius: (INDICATOR_HEIGHT + 5) / 2,
    flexDirection: 'row',
    alignItems: 'center'
  },
  indicator: {
    // width: INDICATOR_HEIGHT,
    // height: INDICATOR_HEIGHT,
    // borderRadius: INDICATOR_HEIGHT / 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2
  },
  activeView: {
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inactiveView: {
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default ScrollSwitch;
