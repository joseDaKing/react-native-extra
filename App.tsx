import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import * as hooks from './packages/media-query/src';



export default function App() {

  const isMatching = hooks.useMediaQuery("(aspect-ratio: 1/2) and (max-width: 1024px)")

  return (
    <View 
    style={styles.container}>
       
      <hooks.OnMediaQuery
      aspectRatio={[1, 2]}
      maxWidth={1024}>
        <Text>
          Open up App.tsx to start working on your app!
        </Text>
      </hooks.OnMediaQuery>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
