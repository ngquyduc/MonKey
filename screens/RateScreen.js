import React, {useState, useEffect} from 'react'
import { Text, View, Alert, StyleSheet, TouchableOpacity, TextInput, Pressable, Keyboard } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenWidth } from '../components/constants';
import { ShadowBox } from 'react-native-neomorph-shadows';
import { getUserID } from '../api/authentication';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../api/db';
import { StatusBarHeight } from '../components/constants';
import { Snackbar } from 'react-native-paper';
import { colors } from '../components/colors';
import { Rating } from 'react-native-ratings';
import CurrencyInput from 'react-native-currency-input';
import SectionContainer from '../components/Containers/SectionContainer';
const { lightYellow, lighterBlue, beige, darkBlue, darkYellow } = colors

const RateScreen = ({navigation}) => {
  const [rating, setRating] = useState(3.5);
  const [feedback, setFeedback] = useState('');
  const [visible, setVisible] = useState(false)
  const onSubmit = () => {
    setRating(3.5)
    setFeedback('')
    setVisible(true)
  }
  return (
    <View style={styles.container}>
      <Pressable onPress={Keyboard.dismiss} style={{flex:1}}>
        <View style={styles.header}>
          <View style={{flex:2, paddingLeft:5, paddingBottom:7}}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
              <MaterialCommunityIcons name='chevron-left' size={44} color={darkBlue}/>
            </TouchableOpacity>
          </View>
          <View style={{flex:8,alignItems:'center',justifyContent:'center'}}>
            <Text style={styles.boldBlueHeaderText}>Rate it!</Text>
          </View>
          <View style={{flex:2}}></View>
        </View>
        <View style={styles.ratingView}>
          <Rating
            type='heart'
            ratingCount={5}
            fractions={1}
            startingValue={rating}
            imageSize={40}
            showRating
            onFinishRating={value => {setRating(value)}}
            style={{ paddingVertical: 10, borderWidth:0 }}
          />
        </View>
        <View style={styles.feedbackView}>
          <View>
            <Text style={{color:darkBlue, fontSize:17, fontWeight:'400', paddingBottom:8}}>Any feedback?</Text>
          </View>
          <ShadowBox
            inner // <- enable inner shadow
            useSvg // <- set this prop to use svg on ios
            style={{
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.6,
              shadowColor: '#999',
              shadowRadius: 3,
              borderRadius: 20,
              backgroundColor:'#f1fbfd',
              height:243,
              width:ScreenWidth-70
            }}
          >
            <TextInput
              style={{padding:20, marginVertical:15}}
              placeholder='Write your feedback here!!!'
              multiline={true}
              value={feedback}
              onChangeText={value => setFeedback(value)}
            />
          </ShadowBox>
        </View>
        <View style={[styles.submitButtonView, {alignItems:'center', justifyContent:'center', }]}>
          <TouchableOpacity 
          style={[styles.inputButton, {borderRadius:10, backgroundColor:darkYellow,width:120}]} 
          onPress={() => {onSubmit()}}> 
          {/*********** modify function onSubmitEdit and editRow (Ctrl F) ***********/}
            <Text style={styles.cancelText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
      <View style={{justifyContent:'flex-end'}}>
        <Snackbar
          visible={visible}
          onDismiss={()=>setVisible(false)}
          action={{
            label: 'Close',
            onPress: () => {
              // Do something
            },
          }}
          duration={1000}>
          Feedback submitted!
        </Snackbar>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems:'flex-end', 
    justifyContent:'center',
    flexDirection:'row',
    backgroundColor:'#fff',
    borderBottomColor:'#808080',
    borderBottomWidth:1,
    height: StatusBarHeight + 48,
  },
  boldBlueHeaderText: {
    fontSize: 34,
    color: darkBlue,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  ratingView: {
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#fff',
    borderRadius:25,
    marginBottom:15,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    elevation:5,
    marginHorizontal:20,
    paddingVertical:30,
    marginTop:20,
  },
  feedbackView: {
    flexDirection:'column',
    alignItems:'center',
    backgroundColor: '#fff',
    borderRadius:25,
    marginBottom:10,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    elevation:5,
    marginHorizontal:20,
    height:300,
    padding:10
  },
  noteView: {
    borderRadius:20,
    backgroundColor:'#f1fbfd',
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    elevation:-3,
    height:243,
    width:ScreenWidth-70
  },
  submitButtonView: {
    marginTop: 10, 
    alignItems:'center',
    justifyContent:'center',
    paddingBottom:4,
    paddingTop:4,
    paddingLeft:4,
    borderBottomColor: '#E9E9E9',
    borderTopColor: '#E9E9E9',     
    height:48
  },
  cancelText: {
    fontSize:18,
    color:'#fff',
    fontWeight:'500',
  },
  inputButton: {
    padding: 5,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10,
    backgroundColor:darkYellow,
    width:120
  },
})
export default RateScreen;