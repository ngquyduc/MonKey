import React, {useState, useEffect} from 'react'
import MainContainer from '../components/Containers/Main';
import KeyboardAvoidingContainer from '../components/Containers/KeyboardAvoiding';
import { Text, View } from 'react-native';
import styles from '../components/styles';
import TextInputWithIcon from '../components/Containers/TextInputWithIcon';
import SignUpButton from '../components/Containers/SignUpButton';
import { handleSignup } from '../api/authentication';
import { StatusBar } from 'expo-status-bar';
import Login from './Login';

const SignUp = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfPassword, setCfPassword] = useState("");

  return (
    <>
      <StatusBar style='dark'/>
      <MainContainer>
        <KeyboardAvoidingContainer>
          <View style={{alignContent: 'left', paddingBottom: 20}}>
            <Text style={styles.boldBlueText}>Sign-up</Text>
          </View>
            <TextInputWithIcon
              label='Username'
              icon='user'
              placeholder='YourUsername'
              value={username}
              autoCapitalize = 'none'
              onChangeText={text => setUsername(text)}
            />
            <TextInputWithIcon
              label='Email address'
              icon='mail'
              placeholder='yourmail@gmail.com'
              keyboardType='email-address'
              value={email}
              autoCapitalize = 'none'
              onChangeText={text => setEmail(text)}
            />
            <TextInputWithIcon
              label='Password'
              icon='lock-open'
              placeholder='* * * * * * * *'
              isPassword={true}
              value={password}
              autoCapitalize = 'none'
              onChangeText={text => setPassword(text)}
            />
            <TextInputWithIcon
              label='Confirm password'
              icon='lock-open'
              placeholder='* * * * * * * *'
              isPassword={true}
              value={cfPassword}
              autoCapitalize = 'none'
              onChangeText={text => setCfPassword(text)}
            />
            <SignUpButton onPress={() => {handleSignup(email, password)
            navigation.navigate('Login')}}>Sign-up</SignUpButton>
        </KeyboardAvoidingContainer>
      </MainContainer>
    </>
  )
}

export default SignUp;