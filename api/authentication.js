import { app } from "./firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const authentication = getAuth(app);
const navigation = useNavigation;

export const handleSignup = (email, password) => {
  createUserWithEmailAndPassword(authentication, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log('Signed up with email', user.email)
  })
  .catch((error) => {
    console.log(error.message);
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
  });
}

export const autoNav = (nav) => {
  onAuthStateChanged(authentication, (user) => {
    if (user) {
      // User is already logged in
      console.log(user.email)
      nav.navigate("Tabs")
    }
  });
}

export const handleSignOut = (nav) => {
  signOut(authentication)
  .then(nav.navigate('Login'))
  ;
}

export const getUserEmail = () => {
  const user = authentication.currentUser;
  if (user !== null) {
    // The user object has basic properties such as display name, email, etc.
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;

    // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
    const uid = user.uid;
    console.log('email is', email);
  } else {
    console.log('not signed in yet')
  }
}

export const sendResetPasswordEmail = (email, nav) => {
  sendPasswordResetEmail(authentication, email)
    .then(() => {
      nav.navigate('Login')
      Alert.alert('Check your inbox for further instructions')   
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}