import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput , View, Button, Alert,TouchableWithoutFeedback,KeyboardAvoidingView , Keyboard } from 'react-native';
import React from "react";
import Login from './screens/Login';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/tabs';

export default function App() {
  return (
    <>
      <StatusBar style = "light"/>
      {/* <Signup></Signup> */}
      <Login></Login>
    </>
    // <NavigationContainer>
    //   <Tabs/>
    // </NavigationContainer>
  )
}
