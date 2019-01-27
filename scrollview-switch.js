import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

class ScrollSwitch extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      isActive: this.props.active || false
    };
    this.borderWidth = 2;
    this.universalPadding = 2;
    this.viewPortRadius =  this.props.radius +  this.universalPadding; // (90/360) * 2 * 3.142 * this.props.radius;
    this.textMargin = 5;
    this.viewPortWidth = this.props.width + this.viewPortRadius + (2 * this.props.radius) + ( 2 * this.universalPadding) + this.textMargin;
    this.initailContentOffset = this.props.active ? 0 : this.props.width + this.viewPortRadius + this.textMargin;
  }

  async componentDidMount() {
    if (!this.props.active) {
      setTimeout(() => {
        this.scrollRef.scrollToEnd({ animated: false });
      }, 10);
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

  onDragEnd = (e) => {
    const { contentOffset } = e.nativeEvent;
    console.log(contentOffset.x);
    console.log(e.nativeEvent, contentOffset, contentOffset.x, this.props.width)
    if(contentOffset.x > (this.props.width + this.viewPortRadius) / 2) {
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
            height: this.props.radius * 2 +  this.universalPadding * 2,
            opacity: 1,
            borderRadius: this.viewPortRadius,
            borderWidth: this.borderWidth,
            borderColor: isActive ? activeBorder : inactiveBorder,
            backgroundColor: isActive? active: inactive
          }
        ]}
      >
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
          style={{ width: this.viewPortWidth }}
        >
          <View
            style={[
              styles.container,
              { 
                opacity,
                height:  this.props.radius * 2 +  this.universalPadding * 2 
              },
              { backgroundColor: isActive? active: inactive  },
              
            ]}
          >
            <View
              style={[
                styles.activeView,
                { 
                  width: this.props.width,
                  marginLeft: this.viewPortRadius
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
                 padding: this.universalPadding 
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
                { width: this.props.width, marginRight: this.viewPortRadius }
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
