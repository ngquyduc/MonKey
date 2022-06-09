import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput , View, Button, Alert,TouchableWithoutFeedback,KeyboardAvoidingView , Keyboard } from 'react-native';
import React from "react";
import Login from './screens/Login';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './navigation/tabs';

/********Check this part to see what are needed********/
import { getApps, initializeApp } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import auth from 'firebase/auth';
import { createContext } from 'react';
import { useState } from 'react';
import { async } from '@firebase/util';
/*******************************************************/

const AuthContent = createContext();
const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContent.Provider>
      value = {{
        user, 
        setUser,
        login: async (email, password) => {
          try {
            await auth.signInWithEmailAndPassword(email,password)
          } catch(e) {
            console.log(e);
          }
        },
        register: async (email, password) => {
          try {
            await auth.createUserWithEmailAndPassword(email, password)
          } catch(e) {
            console.log(e);
          }
        },
        login: async () => {
          try {
            await auth.signOut();
          } catch(e) {
            console.log(e);
          }
        }
      }}
    </AuthContent.Provider>
  )
}


export default function App() {
  return (
    // <>
    //   <StatusBar style = "light"/>
    //   <Dashboard></Dashboard>
    // </>
    <NavigationContainer>
      <Tabs/>
    </NavigationContainer>
  )
}
