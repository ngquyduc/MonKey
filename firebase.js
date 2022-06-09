// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMC_w_lT-uO_i9zcaLsKk1mv1HqFD0i3I",
  authDomain: "monkey-dd410.firebaseapp.com",
  projectId: "monkey-dd410",
  storageBucket: "monkey-dd410.appspot.com",
  messagingSenderId: "228163695494",
  appId: "1:228163695494:web:987fe69ec8e64aaa09b207",
  measurementId: "G-GYS3C7CNPG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);