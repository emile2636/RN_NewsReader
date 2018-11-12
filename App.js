import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Index from './components/Index';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Index />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
    alignItems: 'center',
    // justifyContent: 'center',
  }
});
