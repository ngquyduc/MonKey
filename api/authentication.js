import { app } from "./firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import { Alert } from "react-native";

export const authentication = getAuth(app);

export const handleSignup = (email, password) => {
  createUserWithEmailAndPassword(authentication, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log('Signed up with email', user.email)
  })
  .catch((error) => {
    console.log(error.message);
    Alert.alert("Warning", error.message, [
      {text: 'Understand', onPress: () => console.log('Alert closed')}
    ])
  });
}

export const handleLogIn = (email, password) => {
  signInWithEmailAndPassword(authentication, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log("Logged in with email", user.email);
  })
  .catch((error) => {
    console.log(error.message);
    Alert.alert("Warning", error.message, [
      {text: 'Understand', onPress: () => console.log('Alert closed')}
    ])
  });
}

export const autoNav = (nav) => {
  onAuthStateChanged(authentication, (user) => {
    if (user) {
      nav.navigate("InnerScreenNav")
    } else {
      nav.navigate("Login")
    }
  });
}

export const handleSignOut = (nav) => {
  signOut(authentication)
    .catch((error) => {
      console.log(error.message);
    })
}

export const displayUserID = () => {
  const user = authentication.currentUser;
  if (user !== null) {
    console.log(user);
  } else {
    console.log('not signed in yet')
  }
}

export const getUserID = () => {
  const user = authentication.currentUser;
  if (user !== null) {
    return user.uid;
  } else {
    return "";
  }
}

export const sendResetPasswordEmail = (email, nav) => {
  sendPasswordResetEmail(authentication, email)
    .then(() => {
      nav.navigate('Login')
      console.log('Check your inbox for further instructions')   
    })
    .catch((error) => {
      console.log(error.message)
      Alert.alert("Warning", error.message, [
        {text: 'Understand', onPress: () => console.log('Alert closed')}
      ])
    });
}