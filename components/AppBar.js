import * as React from 'react';
import { Appbar, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const AppBar = () => (
  <Appbar.Header style={styles.title} >
    <Text style={styles.titleText} variant="displayMedium">New Flatpaks</Text>
  </Appbar.Header>
);

const styles = StyleSheet.create({
  title: {
    backgroundColor: '#241f31',
  },
  titleText: {
    color:'white',
  },
});

export default AppBar;