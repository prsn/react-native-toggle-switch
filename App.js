/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, FlatList} from 'react-native';
import AnimatedListItem from './animated-list-item';
import AnimatedListItemWithNativeDriver from './animated-list-item-with-native-driver';
import Switch from './switch';
import ScrollSwitch from './scrollview-switch';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
console.disableYellowBox=true;
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      todos: []
    };
  }
  addTodo = () => {
    this.setState({
      todos: [{no: `${this.state.todos.length}`, text: `Added at ${this.state.todos.length}`}, ...this.state.todos]
    });
  }

  animatedRenderer = ({item: data}) => {
    return (
      <AnimatedListItem style={{borderColor: 'green', flex: 1}} height={50} duration={800} key={data.no}>
        <View style={{ flex: 1, backgroundColor: 'white', borderColor: 'grey' ,borderRadius: 4, borderWidth: 0.5}}><Text style={styles.welcome}>{data.text}</Text></View>
      </AnimatedListItem>
    );
  }

  animatedWithTransforRenderer = ({item: data}) => {
    return (<AnimatedListItemWithNativeDriver  style={{borderColor: 'green', flex: 1}} height={150} duration={800} key={data.no}>
      <View style={{ flex: 1, backgroundColor: 'white', borderColor: 'grey' , borderRadius: 0, borderWidth: 0.5}}><Text style={styles.welcome}>{data.text}</Text></View>
    </AnimatedListItemWithNativeDriver>);
  }

  vanilaRenderer = (data) => <View style={{height: 50, backgroundColor: 'grey'}}><Text>{data.text}</Text></View>

  renderAnimatedList() {
    return (
      <View style={styles.container}>
        <View style={{ alignSelf: 'stretch', backgroundColor: 'yellow'}}>
          <Text style={{flexDirection: 'row'}}>Rendering items...</Text>
        </View>
        <FlatList
          keyExtractor={({no}) => `key-${no}`}
          data={this.state.todos}
          renderItem={this.animatedRenderer}
          style={{ flex: 1, alignSelf: 'stretch', backgroundColor: '#876543', borderColor: 'green', borderRadius: 4, borderWidth: 2.5}}
          inverted={true}
        />
        <Button title="add todo" onPress={() =>{
          this.addTodo();
        }}/>
        <Button title="clear todo" onPress={() =>{
          this.setState({ todos: [] });
        }}/>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Switch text={{on: 'PRESENT', off: 'ABSENT'}} color={{indicator: 'white', active: 'rgba(32, 193, 173, 1)', inactive:  'rgba( 247, 247, 247, 1)'}} active={false}/> */}
        {/* <Switch text={{on: 'PRESENT', off: 'ABSENT'}} color={{indicator: 'white', active: 'rgba(32, 193, 173, 1)', inactive:  'rgba( 247, 247, 247, 1)'}} active={true}/> */}
        <ScrollSwitch
          text={{on: 'PRESENT', off: 'ABSENT', activeTextColor: 'white', inactiveTextColor: '#B7B8BA'}}
          textStyle={{fontWeight: 'bold'}}
          color={{indicator: 'white', active: 'rgba(32, 193, 173, 1)', inactive:  'rgba( 247, 247, 247, 1)', activeBorder: '#41B4A4', inactiveBorder: '#E9E9E9'}}
          active={true}
          disabled={true}
          onValueChange={(val) => {
            console.log(val)
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
    marginTop: 50,
    paddingLeft: 10
  },
  welcome: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
    color: '#333333'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
