import React, { } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import AppBar from './components/AppBar';
import Flatlist from './components/Flatlist';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
    <View style={styles.container}>
      <StatusBar style="auto" />
      <AppBar></AppBar>
      <Flatlist></Flatlist>
    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'left',
    justifyContent: 'center',
  },
});
