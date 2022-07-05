import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import PressableText from '../components/Containers/PressableText';
import { getUserID, handleSignOut } from '../api/authentication';
import { StatusBarHeight } from '../components/constants';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../components/colors';
import { Avatar, Drawer } from 'react-native-paper';
import { copyDefaultCategory } from '../api/authentication';
import IncomeCategory from '../CategoriesList/IncomeCategory';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../api/db';
const {beige, brown, darkBlue, lightBlue, darkYellow, lightYellow} = colors;
const Other = ({navigation}) => {
  const [image, setImage] = useState('');
  const [username, setUsername] = useState('Team Grape')
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  const askChangeAvatar = () => {
    Alert.alert("Change avatar?", "", [
      {text: 'No', onPress: () => console.log('Alert closed')},
      {text: 'Yes', onPress: pickImage}
    ]);
  }

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
        {/* <PressableText onPress={() => {
          const IncomeDefault = collection(db, 'Input Category/Income/default')
          IncomeCategory.forEach((doc) => {if (doc.name != 'Edit') addDoc(IncomeDefault, {
            name: doc.name,
            icon: doc.icon,
            color: doc.color
          })})
        }}>
          copyDefaultCategory
        </PressableText> */}
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
    backgroundColor:lightYellow,
    borderBottomColor:'#808080',
    borderBottomWidth:1,
    paddingTop:3,
    height: StatusBarHeight + 48,
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