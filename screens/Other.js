import React, {useEffect, useState, useCallback} from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import PressableText from '../components/Containers/PressableText';
import { getUserID, handleSignOut } from '../api/authentication';
import { StatusBarHeight } from '../components/constants';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../components/colors';
import { Avatar, Drawer } from 'react-native-paper';
import { MaterialCommunityIcons  } from '@expo/vector-icons'
import SectionContainer from '../components/Containers/SectionContainer';
import { copyDefaultCategory } from '../api/authentication';

import { addDoc, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../api/db';
const {beige, lighterBlue, brown, darkBlue, lightBlue, darkYellow, lightYellow} = colors;

const Other = ({navigation}) => {
  const [image, setImage] = useState('');
  const [username, setUsername] = useState('')
  const [isChangeUsername, setIsChangeUsername] = useState(false);
  const changePicture = (pictureURI) => {
    const userRef = doc(db, 'Users', getUserID())
    updateDoc(userRef, {
      profilePhoto: pictureURI
    })
  }

  const changeUsername = (userName) => {
    const userRef = doc(db, 'Users', getUserID())
    updateDoc(userRef, {
      username: userName
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

  const URL = 'https://docs.google.com/document/d/1zk38ozwSbzv1nOYVJ0l_zQG_MHjvM1UZOu_qnUJOm3A/edit?usp=sharing'
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(URL);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(URL);
    } else {
      Alert.alert(`Cannot open the instructions URL: ${URL}`);
    }
  }, [URL]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.boldBlueHeaderText}>Other</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        {/************ User image + name ************/}
        <View style={styles.userView}>
          <View style={styles.imageView}>
            <TouchableOpacity onPress={askChangeAvatar}>
            {image == '' && <Avatar.Image source={{ uri: "https://cdn.landesa.org/wp-content/uploads/default-user-image.png" }} size={100} />}
            {image != '' && <Avatar.Image source={{ uri: image }} size={100} />}
            </TouchableOpacity>
          </View>
          <View style={styles.usernameView}>
            <Text style={styles.boldBlackHeaderText}>{username}</Text>
          </View>
        </View>
        <View style={styles.divider}>
          <Text style={{color:'#b2b2b2', fontSize:16}}>Personalize</Text>
        </View>
        {/************ Set limit ************/}
        <SectionContainer
          title='Expense limit setting'
          onPress={() => navigation.navigate('EditLimitScreen')}
          iconName='circle-edit-outline'
        />
        {/************ Modify expense category list ************/}
        <SectionContainer
          title='Income category setting'
          onPress={() => navigation.navigate('ListOfIncomeCategory')}
          iconName='playlist-edit'
        />
        {/************ Modify income category list ************/}
        <SectionContainer
          title='Expense category setting'
          onPress={() => navigation.navigate('ListOfExpenseCategory')}
          iconName='playlist-edit'
        />
        <View style={styles.divider}>
          <Text style={{color:'#b2b2b2', fontSize:16}}>MonKey</Text>
        </View>
        {/************ Help ************/}
        <SectionContainer
          title='Help'
          onPress={handlePress}
          iconName='help-circle-outline'
        />
        {/************ About us ************/}
        <SectionContainer
          title='About us'
          onPress={() => navigation.navigate('AboutUs')}
          iconName='information-outline'
        />
        <View style={styles.divider}>
          <Text style={{color:'#b2b2b2', fontSize:16}}>Feedback</Text>
        </View>
        {/************ Rating ************/}
        <SectionContainer
          title='Rate this MonKey'
          onPress={() => navigation.navigate('RateScreen')}
          iconName='star-outline'
        />
        <View style={styles.divider}>
          <Text style={{color:'#b2b2b2', fontSize:16}}>Sign out</Text>
        </View>
        {/************ Sign out ************/}
        <View style={styles.sectionView}>
          <TouchableOpacity onPress={() => handleSignOut(navigation)}>
            <View style={{flexDirection:'row'}}>
              <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                <MaterialCommunityIcons name='logout' size={24} color='#494949'/>
                <Text style={{fontSize:16, color: '#494949', fontWeight:'bold'}}>  Sign out</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  }, 
  scrollContainer: {
    flex: 1,
    marginTop:6,
    backgroundColor: '#f3f3f3',
  }, 
  boldBlueHeaderText: {
    fontSize: 34,
    color: darkBlue,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  boldBlackHeaderText: {
    fontSize: 30,
    fontWeight: '500',
    color: '#494949',
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
    backgroundColor:'#fff',
    flexDirection: 'row',
    paddingTop:12,
    paddingBottom:15,
    paddingLeft:20,
    borderBottomColor: '#E9E9E9',  
    borderBottomWidth:1,  
  },
  imageView: {
    flex: 3,
    justifyContent:'center', 
  },
  usernameView: {
    flex: 7,
    paddingLeft:0,
    alignItems:'center',
    justifyContent:'center',
  },
  divider: {
    backgroundColor:'#f3f3f3', 
    flexDirection:'row', 
    height:36,
    borderTopColor: '#E9E9E9',  
    borderTopWidth:1,     
    alignItems:'center',
    justifyContent:'center'
  },
  sectionView: {
    backgroundColor:'#fff',
    justifyContent:'center',
    paddingBottom:4,
    paddingTop:4,
    paddingLeft:12,
    paddingRight:16,
    borderTopColor: '#E9E9E9',  
    borderBottomColor: '#E9E9E9', 
    borderTopWidth:1,  
    borderBottomWidth:1,     
    height:48,
  },
})

export default Other;