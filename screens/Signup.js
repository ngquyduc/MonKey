import React, {useState} from 'react'
import MainContainer from '../components/Containers/Main';
import KeyboardAvoidingContainer from '../components/Containers/KeyboardAvoiding';
import { Text, View } from 'react-native';
import styles from '../components/styles';
import TextInputWithIcon from '../components/Containers/TextInputWithIcon';
import SignUpButton from '../components/Containers/SignUpButton';
import { handleSignup } from '../api/authentication';

const SignUp = () => {
  // const [username, setUsername] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
            onChangeText={text => setEmail(text)}
          />
          <TextInputWithIcon
            label='Password'
            icon='lock-open'
            placeholder='* * * * * * * *'
            isPassword={true}
            value={password}
            onChangeText={text => setPassword(text)}
          />
          {/* <TextInputWithIcon
            label='Confirm password'
            icon='lock-open'
            placeholder='* * * * * * * *'
            isPassword={true}
            value={password}
          /> */}
          <SignUpButton onPress={() => handleSignup(email, password)}>Sign-up</SignUpButton>
      </KeyboardAvoidingContainer>
    </MainContainer>
  )
}

export default SignUp;