import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform, StyleSheet, Text, View,
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\nCmd+D or shake for dev menu',
  android:
  'Double tap R on your keyboard to reload,\n'
  + 'Shake or press menu button for dev menu',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

const Dummy = ({ greeting }) => (
  <View style={styles.container}>
    <Text style={styles.welcome}>{greeting}</Text>
    <Text style={styles.instructions}>To get started, edit App.js</Text>
    <Text style={styles.instructions}>{instructions}</Text>
  </View>
);

Dummy.propTypes = {
  greeting: PropTypes.string.isRequired,
};

export default Dummy;
