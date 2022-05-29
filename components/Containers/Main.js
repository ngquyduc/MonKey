import React from "react";
import { View } from "react-native";
import styles from "../styles";

const MainContainer = (props) => {
  return (
    <View style = {styles.mainContainer}>{ props.children }</View>
  )
}

export default MainContainer;