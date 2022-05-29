import React from "react";
import { KeyboardAvoidingView, ScrollView, Keyboard, Platform, Pressable} from "react-native";
import styles from "../styles";

const KeyboardAvoidingContainer = (props) => {
  return (
    <KeyboardAvoidingView
      style = {styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator = {false}>
        <Pressable onPress={Keyboard.dismiss}>{ props.children }</Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingContainer;