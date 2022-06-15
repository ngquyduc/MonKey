import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput , View, Button, Alert,TouchableWithoutFeedback,KeyboardAvoidingView , Keyboard } from 'react-native';
import React from "react";
import AuthNavigation from './navigation/authNavigation';
import Expense from './screens/inputScreen/Expense';
import Tabs from './navigation/tabs';
import { NavigationContainer } from '@react-navigation/native';
import { unsubscribe } from './api/authentication';
import ForgotPassword from './screens/ForgotPassword';

export default function App() {
  return (
    // <NavigationContainer><Tabs></Tabs></NavigationContainer>
    // <AuthNavigation></AuthNavigation>
    <ForgotPassword></ForgotPassword>
  )
}
