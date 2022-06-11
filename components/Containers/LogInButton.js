import styles from "../styles";
import { Text, TouchableOpacity } from 'react-native'
import { colors } from "../colors";

const {} = colors;

const LogInButton = (props) => {
  return (
    <TouchableOpacity style={styles.signInUpButton} onPress={props.onPress}>
      <Text style={styles.loginText}>{props.children}</Text>
    </TouchableOpacity>
  )
}

export default LogInButton;
