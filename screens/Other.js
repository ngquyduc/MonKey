import React, {useEffect} from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import styles from '../components/styles';
import PressableText from '../components/Containers/PressableText';
import { autoNav, getUserEmail, handleSignOut } from '../api/authentication';
import { handleExpense } from '../api/db';

const Other = ({navigation}) => {
  return (
    <View style={styles.mainContainer}>
      <Text>Other</Text>
      <PressableText onPress={() => {
        handleSignOut(navigation)
      }}>Sign Out</PressableText>
      <PressableText onPress={() => {
        getUserEmail()
      }}>User</PressableText>
      <PressableText onPress={() => {
        handleExpense()
      }}>Add Data</PressableText>
    </View>
  );
}

export default Other;