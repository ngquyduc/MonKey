import React, {useState, useEffect} from 'react'
import MainContainer from '../components/Containers/Main';
import KeyboardAvoidingContainer from '../components/Containers/KeyboardAvoiding';
import { Text, View, ActivityIndicator, Alert } from 'react-native';
import styles from '../components/styles';
import TextInputWithIcon from '../components/Containers/TextInputWithIcon';
import LogInButton from '../components/Containers/LogInButton';
import PressableText from '../components/Containers/PressableText';
import { autoNav, handleLogIn, sendResetPasswordEmail } from '../api/authentication';
import SignUp from './Signup';

const ForgotPassword = ({navigation}) => {
  useEffect(() => autoNav(navigation), []);

  const [email, setEmail] = useState('');

  return (
    <MainContainer>
      <KeyboardAvoidingContainer>
        <View style={{alignContent: 'center', paddingBottom: 10}}>
          <Text style={styles.boldBlueText}>Reset your password</Text>
          {/* <Text style={styles.italicText}>Hello, welcome back to your account!</Text> */}
        </View>
          <TextInputWithIcon
            label='Enter your email address'
            icon='mail'
            placeholder='yourmail@gmail.com'
            keyboardType='email-address'
            value={email}
            autoCapitalize = 'none'
            onChangeText={text => setEmail(text)}
          />
          <LogInButton onPress={() => sendResetPasswordEmail(email, navigation)}>Send Password Reset Email</LogInButton>
      </KeyboardAvoidingContainer>
    </MainContainer>
  )
}

export default ForgotPassword;