import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput , View, Button, Alert,TouchableWithoutFeedback,KeyboardAvoidingView , Keyboard } from 'react-native';
import React from "react";
import Login from './screens/Login';

export default function App() {
  return (
    <>
      <StatusBar style = "light"/>
      <Login></Login>
    </>
  )
}

// const userAuthenticationInterace = () => {
//   const [username, onChangeUsername] = React.useState(null);
//   const [password, onChangePassword] = React.useState(null);
//   return (
//     <KeyboardAvoidingView
//     behavior={"height"}
//     style={styles.container}
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View style = {[styles.container, {
//           flexDirection: "column"}]}>
//           <View style = {[styles.container, { flex: 5 }]}>
//             <Text style = {styles.appName}>MonKey</Text>
//           </View>
//           <View style = {[styles.container, { flex: 4 }]}>
//             <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={styles.container}
//             >
//               <TextInput
//                 style = {styles.input}
//                 placeholder='Username'
//                 onChangeText = {onChangeUsername}
//                 value = {username}
//               />
//               <TextInput
//                 style = {styles.input}
//                 placeholder='Password'
//                 onChangeText = {onChangePassword}
//                 value = {password}
//               />
//               <Button
//                 title="Sign in"
//                 color="#a67e32"
//                 onPress={() => Alert.alert('To be updated')}
//               />
//               <Button
//                 title="New to MonKey? Click here to sign-up"
//                 color="#a67e32"
//                 onPress={() => Alert.alert('To be updated')}
//               />
//             </KeyboardAvoidingView>
//           </View>
//           <View style = {[styles.container, { flex: 2 }]}/>
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
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