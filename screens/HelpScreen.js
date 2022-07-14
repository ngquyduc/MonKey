import React, {useState, useEffect} from 'react'
import { Text, View, Alert, StyleSheet, TouchableOpacity, TextInput, Pressable, Keyboard } from 'react-native';
import { Feather, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import { getUserID } from '../api/authentication';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../api/db';
import { StatusBarHeight } from '../components/constants';
import { colors } from '../components/colors';
import {Slider} from '@miblanchard/react-native-slider';
import CurrencyInput from 'react-native-currency-input';
const { lightYellow, lighterBlue, lightBlue, darkBlue, darkYellow } = colors

const HelpScreen = () => {
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Help</Text></View>
  )
}

export default HelpScreen;