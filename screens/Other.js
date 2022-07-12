import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import PressableText from '../components/Containers/PressableText';
import { getUserID, handleSignOut } from '../api/authentication';
import { StatusBarHeight } from '../components/constants';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../components/colors';
import { Avatar, Drawer } from 'react-native-paper';
import { copyDefaultCategory } from '../api/authentication';

import { addDoc, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../api/db';
const {beige, lighterBlue, brown, darkBlue, lightBlue, darkYellow, lightYellow} = colors;
const Other = ({navigation}) => {
  const [image, setImage] = useState('');
  const [username, setUsername] = useState('')

  const changePicture = (pictureURI) => {
    const userRef = doc(db, 'Users', getUserID())
    updateDoc(userRef, {
      profilePhoto: pictureURI
    })
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      changePicture(result.uri)
    }
    
  };

  const askChangeAvatar = () => {
    Alert.alert("Change avatar?", "", [
      {text: 'No', onPress: () => console.log('Alert closed')},
      {text: 'Yes', onPress: pickImage}
    ]);
  }

  useEffect(() => {
    const userRef = doc(db, 'Users', getUserID())
    onSnapshot(userRef, (snapshot) => {
      setUsername(snapshot.data().username)
      setImage(snapshot.data().profilePhoto)
    })
  }, [])


  return (
    <>
      <View style={styles.header}>
        <Text style={styles.boldBlueHeaderText}>Other</Text>
      </View>
      <ScrollView>
        <View style={styles.userView}>
          <View style={styles.imageView}>
            <TouchableOpacity onPress={askChangeAvatar}>
            {image == '' && <Avatar.Image source={{ uri: "https://cdn.landesa.org/wp-content/uploads/default-user-image.png" }} size={75} />}
            {image != '' && <Avatar.Image source={{ uri: image }} size={75} />}
            </TouchableOpacity>
          </View>
          <View style={styles.usernameView}>
            <Text style={styles.boldBlackHeaderText}>{username}</Text>
          </View>
        </View>
        <PressableText onPress={() => {
          handleSignOut(navigation)
        }}>
          Sign Out
        </PressableText>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 25,
    paddingTop: StatusBarHeight + 30,
    backgroundColor: beige,
  }, 
  boldBlueHeaderText: {
    fontSize: 34,
    color: darkBlue,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  boldBlackHeaderText: {
    fontSize: 25,
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
  },
  header: {
    alignItems:'center', 
    justifyContent:'flex-end',
    backgroundColor:'#fff',
    borderBottomColor:'#808080',
    borderBottomWidth:0,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    paddingTop:3,
    height: StatusBarHeight + 42,
    backgroundColor: lighterBlue,
    shadowColor:darkBlue,
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:3,
  },
  userView: {
    flexDirection: 'row',
    height:120,
    paddingLeft:20
  },
  imageView: {
    flex: 3,
    justifyContent:'center'
  },
  usernameView: {
    flex: 7,
    paddingLeft:0,
    alignItems:'flex-start',
    justifyContent:'center',
  }
})

export default Other;