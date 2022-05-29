import {useState} from 'react'
import styles from "../styles";
import { View, TextInput, Text } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { colors } from "../colors";
const {darkBlue, lightBlue} = colors;

const TextInputWithIcon = ({icon, label, placeholder, keyboardType, isPassword}) => {
  const [isHide, setIsHide] = useState(true);
  
  return (
    <View>
      <View style = {styles.iconContainer}>
        <Entypo name={icon} size={30} color={darkBlue}/>
      </View>
      <Text style={styles. blueRegularText}>{label}</Text>
      <TextInput 
        style={styles.inputContainer}
        placeholder={placeholder}
        placeholderTextColor = {lightBlue}
        keyboardType = {keyboardType}
        secureTextEntry={isPassword && isHide}
      />
    </View>
  )
}

export default TextInputWithIcon;