import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput , View, Button, Alert,TouchableWithoutFeedback,KeyboardAvoidingView , Keyboard } from 'react-native';
import React from "react";
import Login from './screens/Login';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/tabs';

//Check this part to see what are needed
import { getApps, initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


export default function App() {
  return (
    // <>
    //   <StatusBar style = "light"/>
    //   <Dashboard></Dashboard>
    // </>
    <NavigationContainer>
      <Tabs/>
    </NavigationContainer>
  )
}
