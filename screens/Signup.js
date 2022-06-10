import React, {useState} from 'react'
import MainContainer from '../components/Containers/Main';
import KeyboardAvoidingContainer from '../components/Containers/KeyboardAvoiding';
import { Text, View } from 'react-native';
import styles from '../components/styles';
import TextInputWithIcon from '../components/Containers/TextInputWithIcon';
import SignUpButton from '../components/Containers/SignUpButton';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { authentication } from '../firebase';


const SignUp = () => {
  // const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    createUserWithEmailAndPassword(authentication, email, password)
    .then((userCredential) => {
      console.log(userCredential);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <MainContainer>
      <KeyboardAvoidingContainer>
        <View style={{alignContent: 'left', paddingBottom: 20}}>
          <Text style={styles.boldBlueText}>Sign-up</Text>
        </View>
          {/* <TextInputWithIcon
            label='Username'
            icon='user'
            placeholder='YourUsername'
            value={username}
          /> */}
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
          {/* <TextInputWithIcon
            label='Confirm password'
            icon='lock-open'
            placeholder='* * * * * * * *'
            isPassword={true}
            value={password}
          /> */}
          <SignUpButton onPress={handleSignup}>Sign-up</SignUpButton>
      </KeyboardAvoidingContainer>
    </MainContainer>
  )
}

export default SignUp;