import React, { PureComponent } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ToggleSwitch from 'rn-toggle-switch';
import dataSource from './data';

class ToggleSwitchDemo extends PureComponent {
  renderItem = ({ item, index }) => {
    const {
      label,
      activeText = "On",
      inactiveText = "Off",
      activeColor = 'rgba(32, 193, 173, 1)',
      inactiveColor = 'rgba( 247, 247, 247, 1)',
      activeBorderColor = '#41B4A4',
      inactiveBorderColor = '#E9E9E9',
      sliderColor = 'white',
      width = 80,
      radius = 25,
      initialActiveState = true,
      disabled = false
    } = item;
    return (
      <View style={[styles.listItem]} key={`item-${index}`}>
        <Text style={styles.text}>{label}</Text>
        <View style={styles.switchWrapper}>
          <ToggleSwitch
            text={{ on: activeText, off: inactiveText, activeTextColor: 'white', inactiveTextColor: '#B7B8BA'}}
            textStyle={{fontWeight: 'bold'}}
            color={{
              indicator: sliderColor,
              active: activeColor,
              inactive: inactiveColor,
              activeBorder: activeBorderColor,
              inactiveBorder: inactiveBorderColor
            }}
            active={initialActiveState}
            disabled={disabled}
            width={width}
            radius={radius}
            onValueChange={(val) => {
              console.log(val)
            }}
          />
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={[styles.container]}>
        <FlatList
          renderItem={this.renderItem}
          data={dataSource.data}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  listItem: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 3
  },
  text: {
    flexGrow: 1,
  },
  itemSeparator: {
    borderWidth: 0.4,
    borderColor: 'grey'
  },
  switchWrapper: {
    padding: 3
  }
});

export default ToggleSwitchDemo;