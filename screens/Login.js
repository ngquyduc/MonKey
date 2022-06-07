import React, {useState} from 'react'
import MainContainer from '../components/Containers/Main';
import KeyboardAvoidingContainer from '../components/Containers/KeyboardAvoiding';
import { Text, View, ActivityIndicator } from 'react-native';
import styles from '../components/styles';
import TextInputWithIcon from '../components/Containers/TextInputWithIcon';
import LogInButton from '../components/Containers/LogInButton';
import PressableText from '../components/Containers/PressableText';

function handleSubmit() {
  //TO BE UPDATED
}

const Login = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

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
            value={email}
          />
          <TextInputWithIcon
            label='Password'
            icon='lock-open'
            placeholder='* * * * * * * *'
            isPassword={true}
            value={password}
          />
          <LogInButton>Login</LogInButton>
          <PressableText>New to MonKey? Sign-up here</PressableText>
          <PressableText>Forgot password?</PressableText>
      </KeyboardAvoidingContainer>
    </MainContainer>
  )
}

export default Login;