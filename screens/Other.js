import React, {useEffect} from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import styles from '../components/styles';
import PressableText from '../components/Containers/PressableText';
import { handleSignOut } from '../api/authentication';

const Other = ({navigation}) => {
  return (
    <View style={styles.mainContainer}>
      <PressableText onPress={() => {
        handleSignOut(navigation)
      }}>
        Sign Out
      </PressableText>
      {/* <PressableText onPress={() => {
        displayUserID()
      }}>
        getUserID
      </PressableText> */}
    </View>
  );
}

export default Other;