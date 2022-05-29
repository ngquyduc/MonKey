
import styles from "../styles";
import { View, TextInput, Text, TouchableOpacity } from 'react-native'
import { colors } from "../colors";
const {} = colors;

const SignInUpButton = (props) => {
  return (
    <TouchableOpacity style={styles.signInUpButton}>
      <Text style={styles.loginText}>{props.children}</Text>
    </TouchableOpacity>
  )
}

export default SignInUpButton;
