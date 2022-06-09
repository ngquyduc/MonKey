import React, {useState} from 'react'
import MainContainer from '../components/Containers/Main';
import KeyboardAvoidingContainer from '../components/Containers/KeyboardAvoiding';
import { Text, View } from 'react-native';
import styles from '../components/styles';
import TextInputWithIcon from '../components/Containers/TextInputWithIcon';
import SignUpButton from '../components/Containers/SignUpButton';
// import auth from 'firebase/auth';
// const handleSignup = () => {
//   auth
//     .createUserWithEmailAndPassword(email, password)
//     .then(userCredentials => {
//       const user = userCredentials.user;
//       console.log(user.email);
//     })
//     .catch(error => alert(error.message))
// }
import { app } from '../firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = () => {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const auth = getAuth(app);
  const handleSignup = () => {
    createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  }

  return (
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
          />
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
          <TextInputWithIcon
            label='Confirm password'
            icon='lock-open'
            placeholder='* * * * * * * *'
            isPassword={true}
            value={password}
          />
          <SignUpButton onPress = {handleSignup}>Sign-up</SignUpButton>
      </KeyboardAvoidingContainer>
    </MainContainer>
  )
}

export default SignUp;