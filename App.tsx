import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useMediaQuery } from "./packages/media-query/src";


const array = [
  "(prefers-reduced-transparency: none)",
  "(prefers-reduced-motion: none)",
  "(inverted-colors: inverted)",
  "(prefers-color-scheme: light)",
  "(width: 200px)",
  "(height: 200px)",
  "(aspect-ratio: 1/2)",
  "(orientation: 1/2)",
  "(resolution: 200dpi)"
]

export default function App() {
  
  array.forEach(query => {
    
    console.log(query, useMediaQuery(query));
  });

  return (
    <View 
    style={styles.container}>
      <Text>
        Open up App.tsx to start working on your app!
      </Text>
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
