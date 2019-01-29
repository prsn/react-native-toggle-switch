import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ScrollSwitch from './scrollview-switch';
import dataSource from './data';

class ScrollViewDemo extends Component {
  constructor(...props) {
    super(...props);
    this.data = [
      {
        label: 'On/Off state',

      },
      {
        label: 'Active/Inactive state'
      },
      {
        label: 'PRESENT/ABSENT state'
      },
      {
        label: 'PRESENT/ABSENT state'
      }
    ];
  }

  renderItem = ({ item }) => {
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
    console.log('item rendering...');
    return (
      <View style={[styles.listItem]}>
        <Text style={styles.text}>{label}</Text>
        <View style={styles.switchWrapper}>
          <ScrollSwitch
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
    console.log('data rendering', dataSource);
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

export default ScrollViewDemo;
