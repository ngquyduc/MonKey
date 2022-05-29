import {useState} from 'react'
import styles from "../styles";
import { View, TextInput, Text, TouchableOpacity } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { colors } from "../colors";
const {darkBlue, lightBlue} = colors;

const TextInputWithIcon = ({icon, label, placeholder, keyboardType, isPassword, ...props}) => {
  const [isHide, setIsHide] = useState(true);

  return (
    <View>
      <View style = {styles.leftIconContainer}>
        <Entypo name={icon} size={28} color={darkBlue}/>
      </View>
      <Text style={styles.blueRegularText}>{label}</Text>
      <TextInput 
        {...props }
        style={styles.inputContainer}
        placeholder={placeholder}
        placeholderTextColor = {lightBlue}
        keyboardType = {keyboardType}
        secureTextEntry={isPassword && isHide}
        value={props.value}
      />
      {isPassword && <TouchableOpacity 
        style={styles.rightIconContainer}
        onPress={() => {
          setIsHide(!isHide)
        }}
      >
        <Entypo name={isHide ? 'eye-with-line' : 'eye'} size={28} color={darkBlue}/>
      </TouchableOpacity>}
    </View>
  )
}

export default TextInputWithIcon;