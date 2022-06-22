import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput , View, Button, Alert,TouchableWithoutFeedback,KeyboardAvoidingView , Keyboard } from 'react-native';
import React from "react";
import AuthNavigation from './navigation/authNavigation';
import Expense from './screens/Input';
import Tabs from './navigation/tabs';
import { NavigationContainer } from '@react-navigation/native';
import styles from './components/styles';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Input from './screens/Input';
export default function App() {
  return (
    <NavigationContainer><Tabs></Tabs></NavigationContainer>
  )
}
