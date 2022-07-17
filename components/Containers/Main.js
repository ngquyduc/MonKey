import React from "react";
import { View } from "react-native";
import styles from "../styles";
import { StatusBar } from 'expo-status-bar';
const MainContainer = (props) => {
  return (
    <View style = {styles.mainContainer}>
      <StatusBar style='dark'/>
      { props.children }
    </View>
  )
}

export default MainContainer;