import React, {useState} from 'react'
import MainContainer from '../components/Containers/Main';
import KeyboardAvoidingContainer from '../components/Containers/KeyboardAvoiding';
import { Text, View } from 'react-native';
import styles from '../components/styles';
import TextInputWithIcon from '../components/Containers/TextInputWithIcon';

const Login = () => {
  const [username, onChangeUsername] = useState('');
  const [password, onChangePassword] = useState('');

  return (
    <MainContainer>
      <KeyboardAvoidingContainer>
        <View 
          style={{alignItems: 'center' }}>
          <Text style={styles.appName}>MonKey</Text>
        </View>
        <View style={{alignContent: 'left', paddingBottom: 20}}>
          <Text style={styles.boldBlueText}>Login</Text>
          {/* <Text style={styles.italicText}>Hello, welcome back to your account!</Text> */}
        </View>
          <TextInputWithIcon
            label='Email address'
            icon='mail'
            placeholder='yourmail@gmail.com'
            keyboardType='email-address'
          />
          <TextInputWithIcon
            label='Password'
            icon='lock-open'
            placeholder='* * * * * * * *'
            isPassword={true}
          />
      </KeyboardAvoidingContainer>
    </MainContainer>
  )
}

export default Login;