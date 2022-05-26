import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput , View, Button, Alert } from 'react-native';
import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// const userAuthenticationInterace = () => {
//   const [username, onChangeUsername] = React.useState(null);
//   const [password, onChangePassword] = React.useState(null);
//   return (
//     <View style = {[styles.container, {
//       flexDirection: "column"}]}>
//       <View style = {[styles.container, { flex: 3 }]}>
//         <Text style = {styles.appName}>MonKey</Text>
//       </View>
//       <View style = {[styles.container, { flex: 1.5 }]}>
//         <TextInput
//           style = {styles.input}
//           placeholder='Username'
//           onChangeText = {onChangeUsername}
//           value = {username}
//         />
//         <TextInput
//           style = {styles.input}
//           placeholder='Password'
//           onChangeText = {onChangePassword}
//           value = {password}
//         />
//         <Button
//           title="Sign in"
//           color="#a67e32"
//           onPress={() => Alert.alert('')}
//         />
//         <Button
//           title="New to MonKey? Click here to sign-up"
//           color="#a67e32"
//           onPress={() => Alert.alert('Button with adjusted color pressed')}
//         />
//         {/* <Text style = {styles.appName}>MonKey</Text> */}
//       </View>
//       <View style = {[styles.container, { flex: 4}]}/>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "beige",
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   appName: {
//     fontSize: 75,
//     fontWeight: 'bold',
//     color: '#FAB00E',
//     textShadowOffset: {
//       height: 2,
//       width: 2,
//     },
//     textShadowColor: '#67381E',
//     textShadowRadius:2
//   },
//   input: {
//     height: 40,
//     width: 220,
//     margin: 12,
//     borderWidth: 1.7,
//     padding: 10,
//     borderColor: '#a67e32',
//   },
// });

// export default userAuthenticationInterace;


import Input from './screens/Input';
import Calendar from'./screens/Calendar';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Calendar" component={Calendar} />
        <Tab.Screen name="Input" component={Input} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}