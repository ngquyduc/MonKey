import { app } from "./firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Alert } from "react-native";

const authentication = getAuth(app);

export const handleSignup = (email, password) => {
  createUserWithEmailAndPassword(authentication, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    Alert.alert("Signed up with email", user.email);
  })
  .catch((error) => {
    console.log(error.message);
  });
}

export const handleLogIn = (email, password) => {
  signInWithEmailAndPassword(authentication, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    Alert.alert("Logged in with email", user.email);
  })
  .catch((error) => {
    console.log(error.message);
  });
}
