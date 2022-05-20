import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';
import React from "react";

export default function App() {
  let name = "Thanh";
  return (
    <View style={styles.container}>
      <Text>{"Hello World, " + name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#123456',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// const CallerComponent = () => {
//   return (
//   <View>
//     <CalleeComponent phrase="Hello World!" />
//   </View>
//   )
//  };
//  class CalleeComponent extends React.Component {
//   render() {
//   const { phrase } = this.props;
//   return (
//   <Text>{phrase}</Text>
//   );
//   };
//  };
 
//  const CalleeComponent2 = (pr) =>  {
//   return (
//     <Text>{pr.phrase}</Text>
//   );
// };

// export default CallerComponent;
