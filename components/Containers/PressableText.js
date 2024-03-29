import styles from "../styles";
import {  Text, Pressable } from 'react-native'
import { colors } from "../colors";
const {} = colors;

const PressableText = (props) => {
  return (
    <Pressable 
    style={{paddingTop: 10, alignSelf:'center'}}
    onPress={props.onPress}>
      <Text style={styles.blueRegularText}>{props.children}</Text>
    </Pressable>
  )
}

export default PressableText;
