import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform
} from 'react-native';

const textMargin = 8

class ToggleSwitch extends React.Component {
  constructor(props) {
    super(props);

    const universalPadding = this.props.padding || 2

    this.state = {
      isActive: this.props.active || false,
      isLaidOut: Platform.OS === 'ios',
      borderWidth: 2,
      universalPadding,
      viewPortRadius: this.props.radius + universalPadding,
      viewPortWidth: this.props.width + (2 * this.props.radius) + (2 * universalPadding) + textMargin,
      contentOffset: this.props.active ? 0 : this.props.width + textMargin
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { active } = this.props
    if (prevProps.active !== active) {
      this.setState({
        isActive: active,
        contentOffset: active ? 0 : this.props.width + textMargin
      })
      //android fix sync scroll view position with state
      if (active) {
        this.scrollRef.scrollTo({ x: 0, y: 0, animated: false })
      } else {
        this.scrollRef.scrollToEnd({ animated: false });
      }
    }
  }

  //android fix sync scroll view position with state
  onScrollViewContentSizeChange = () => {
    if (this.scrollRef && !this.state.isActive && Platform.OS === 'android') {
      this.scrollRef.scrollToEnd({ animated: false });
    }
    this.setState({ isLaidOut: true })
  }

  setScrollViewRef = (ref) => this.scrollRef = ref

  setTouchableRef = (ref) => this.touchableOpacity = ref

  updateState = (active) => {
    this.setState({
      isActive: active
    }, () => {
      this.props.onValueChange && this.props.onValueChange(active);
    });
  }

  toggleSwitch = () => {
    const { isActive } = this.state;
    if (isActive) {
      this.scrollRef.scrollToEnd();
      this.updateState(false);
    } else {
      this.scrollRef.scrollTo({x: 0, y: 0, animated: true})
      this.updateState(true);
    }
  }

  onDragEnd = (e) => {
    const { contentOffset } = e.nativeEvent;
    if (contentOffset.x > (this.props.width ) / 2) {
      this.scrollRef.scrollToEnd();
      this.updateState(false);
    } else {
      this.scrollRef.scrollTo({x: 0, y: 0, animated: true})
      this.updateState(true);
    }
    //fix for https://github.com/facebook/react-native/issues/29272#issuecomment-653514316
    if (this.touchableOpacity.setOpacityTo != undefined) {
      this.touchableOpacity.setOpacityTo(1, 300);
    } else if (this.touchableOpacity._setOpacityTo != undefined) {
      this.touchableOpacity._setOpacityTo(1, 300);
    }
  }

  onDragStart = (e) => {
    //fix for https://github.com/facebook/react-native/issues/29272#issuecomment-653514316
    if (this.touchableOpacity.setOpacityTo != undefined) {
      this.touchableOpacity.setOpacityTo(0.5, 300);
    } else if (this.touchableOpacity._setOpacityTo != undefined) {
      this.touchableOpacity._setOpacityTo(0.5, 300);
    }
  }

  render() {
    const { text: { on = 'ON', off = 'OFF', activeTextColor, inactiveTextColor },
     color: { active, inactive, indicator, inactiveIndicator, activeBorder, inactiveBorder }, 
     textProps = {},
     textStyle = {},
     disabled = false
    } = this.props;
    const { isActive, isLaidOut, borderWidth, universalPadding, viewPortRadius, viewPortWidth, contentOffset } = this.state;
    
    return (
      <TouchableOpacity onPress={this.toggleSwitch} activeOpacity={1} ref={this.setTouchableRef} disabled={disabled}>
      <View
        style={[
          styles.viewPort,
          { 
            width: viewPortWidth,
            height: this.props.radius * 2 + universalPadding * 2,
            opacity: 1,
            borderRadius: viewPortRadius,
            borderWidth,
            borderColor: isActive ? activeBorder : inactiveBorder,
            backgroundColor: isActive ? active : inactive
          }
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={this.setScrollViewRef}
          onScrollEndDrag={this.onDragEnd}
          onScrollBeginDrag={this.onDragStart}
          scrollEnabled={!disabled}
          scrollsToTop={false}
          contentOffset={{x: contentOffset, y: 0}}
          onContentSizeChange={this.onScrollViewContentSizeChange}
          style={{ width: viewPortWidth }}
        >
          <View
            style={[
              styles.container,
              { 
                opacity: 1,
                backgroundColor: isActive? active : inactive,
                height:  this.props.radius * 2 + universalPadding * 2
              }
            ]}
          >
            <View
              style={[
                styles.activeView,
                { 
                  width: this.props.width,
                  opacity: isLaidOut ? 1 : 0,
                  // marginLeft: viewPortRadius
                }
              ]}
            >
              <Text 
                style={[
                  {
                    alignSelf: 'center', 
                    textAlign: 'center',
                    color: isActive ? activeTextColor : inactiveTextColor
                  },
                  textStyle
                ]}
                {...textProps}
              >
                {on}
              </Text>
            </View>
            <TouchableWithoutFeedback onPress={this.toggleSwitch} disabled={disabled}>
              <View
                style={[
                  styles.indicatorWrapper,
                  {
                    justifyContent: isActive ? 'flex-end' : 'flex-start',
                    padding: universalPadding,
                    opacity: isLaidOut ? 1 : 0,
                  }
                ]}>
                <View
                  style={[
                    styles.indicator,
                    { backgroundColor: isActive ? indicator : inactiveIndicator || indicator, 
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
                { width: this.props.width,
                  opacity: isLaidOut ? 1 : 0,
                  // marginRight: viewPortRadius
                }
              ]}
            >
              <Text
                style={[
                  {
                    alignSelf: 'center', 
                    textAlign: 'center',
                    color: isActive ? activeTextColor : inactiveTextColor
                  },
                  textStyle
                ]}
                {...textProps}
              >
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

const styles = StyleSheet.create({
  viewPort: {
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    alignItems: 'center'
  },
  container: {
    position: 'relative',
    padding: 0,
    flexDirection: 'row',
    alignSelf: 'center'
  },
  indicatorWrapper:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  indicator: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5
  },
  activeView: {
    marginRight: 3,
    marginLeft: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inactiveView: {
    marginLeft: 3,
    marginRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default ToggleSwitch;
