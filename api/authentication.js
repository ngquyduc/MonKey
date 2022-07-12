import { app } from "./firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import { Alert, SegmentedControlIOS } from "react-native";
import { db,} from "./db";
import { collection, addDoc, getDoc, getDocs, setDoc } from "firebase/firestore";

export const authentication = getAuth(app);


const createNewUser = (userId, email, userName) => {
  const userProfileRef = doc(db, 'Users', userId)
  setDoc(userProfileRef, {
    email: email,
    username: userName, 
    profilePhoto: "https://cdn.landesa.org/wp-content/uploads/default-user-image.png"
  })
}

export const copyDefaultCategory = (userId) => {
  const expenseCategoryPath = 'Input Category/Expense/' + userId
  const expenseCategoryRef = collection(db, 'Input Category/Expense/default')
  getDocs(expenseCategoryRef).then((snapshot) => 
  snapshot.docs.forEach((doc) => addDoc(collection(db, expenseCategoryPath), doc.data())))
  .catch((err) => console.log(err.message))
  const incomeCategoryPath = 'Input Category/Income/' + userId
  const incomeCategoryRef = collection(db, 'Input Category/Income/default')
  getDocs(incomeCategoryRef).then((snapshot) => 
  snapshot.docs.forEach((doc) => addDoc(collection(db, incomeCategoryPath), doc.data())))
  .catch((err) => console.log(err.message))
}

export const createDefaultSpendingLimit = (userId) => {
  // const defaultSpendingLimitRef = doc(db, 'Spending Limit', 'default')
  setDoc(spendingLimitRef, {
    monthLimit: 3000,
    dayLimit: 100
  })
}

export const handleSignup = (userName, email, password) => {
  createUserWithEmailAndPassword(authentication, email, password)
  .then((userCredential) => {
    const userId = userCredential.user.uid;
    createNewUser(userId, email, userName)
    copyDefaultCategory(userId)
    createDefaultSpendingLimit(userId)
    Alert.alert('Signed up successfully. Automatically logged in.')
  })
  .catch((error) => {
    console.log(error.message);
    Alert.alert("Warning: ", error.message, [
      {text: 'Understand'}
    ])
  });
}

export const handleLogIn = (email, password) => {
  signInWithEmailAndPassword(authentication, email, password)
  .then((userCredential) => {
    const userEmail = userCredential.user.email;
    Alert.alert("Logged in successfully with email ", userEmail)
  })
  .catch((error) => {
    console.log(error.message);
    Alert.alert("Warning", error.message, [
      {text: 'Understand'}
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