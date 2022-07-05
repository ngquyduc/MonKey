import React, {useState, useEffect} from 'react'
import MainContainer from '../components/Containers/Main';
import KeyboardAvoidingContainer from '../components/Containers/KeyboardAvoiding';
import { Text, View, Alert } from 'react-native';
import styles from '../components/styles';
import TextInputWithIcon from '../components/Containers/TextInputWithIcon';
import SignUpButton from '../components/Containers/SignUpButton';
import { handleSignup } from '../api/authentication';
import { StatusBar } from 'expo-status-bar';

const EditLimitScreen = () => {
  return (
    <View style={{justifyContent:'center', alignItems:'center'}}>
      <Text>EditLimitScreen</Text>
    </View>
  )
}

export default EditLimitScreen;