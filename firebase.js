// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1WPHM218bQZkT6UCwzQVjiMri5KCGra4",
  authDomain: "monkey-29d52.firebaseapp.com",
  projectId: "monkey-29d52",
  storageBucket: "monkey-29d52.appspot.com",
  messagingSenderId: "11207568647",
  appId: "1:11207568647:web:281a90b70012e62866e9a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);


