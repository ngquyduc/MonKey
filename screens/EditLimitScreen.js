import React, {useState, useEffect} from 'react'
import { Text, View, Alert, StyleSheet, TouchableOpacity, TextInput, Pressable, Keyboard } from 'react-native';
import { Feather, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import { getUserID } from '../api/authentication';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../api/db';
import { StatusBarHeight } from '../components/constants';
import { colors } from '../components/colors';
import {Slider} from '@miblanchard/react-native-slider';
import CurrencyInput from 'react-native-currency-input';
const { lightYellow, lighterBlue, lightBlue, darkBlue, darkYellow } = colors


const EditLimitScreen = ({navigation}) => {
  const [monthLimit, setMonthLimit] = useState(0); // need to store on Firestore
  const [dayLimit, setDayLimit] = useState(0); // need to store on Firestore
  
  // get monthlimit and daylimit
  useEffect(() => {
    const spendingLimitRef = doc(db, "Spending Limit", getUserID())
    onSnapshot(spendingLimitRef, (snapShot) => {
      setMonthLimit(snapShot.data().monthLimit)
      setDayLimit(snapShot.data().dayLimit)
    })
  }, [])

  const onSubmit = () => {
    const spendingLimitRef = doc(db, "Spending Limit", getUserID())
    setDoc(spendingLimitRef, {
      monthLimit: monthLimit, 
      dayLimit: dayLimit
    })
  }

  return (
    <View style={{backgroundColor:'#fff', flex:1}}>
      {/*********** Header ***********/}
      <Pressable onPress={Keyboard.dismiss} style={{flex:1}}>
        <View style={styles.header}>
          <View style={{flex:2, paddingLeft:5, paddingBottom:7}}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
              <MaterialCommunityIcons name='chevron-left' size={44} color={darkBlue}/>
            </TouchableOpacity>
          </View>
          <View style={{flex:8,alignItems:'center',justifyContent:'center'}}>
            <Text style={styles.boldBlueHeaderText}>Change limit</Text>
          </View>
          <View style={{flex:2}}></View>
        </View>

        
        {/*********** Month limit ***********/}
        <View style={[styles.noteView,{paddingTop:8}]}>
          <View style={{
            flex:50,
            paddingLeft:12,
            justifyContent:'center'
            }}>
            <Text style={styles.dateText}>Month limit</Text>
          </View>
          <View style={{
            flex:80,
            alignItems:'center',
            justifyContent:'center',
            borderBottomColor:darkYellow,
          }}>
            <CurrencyInput
              style={[styles.inputContainer, {textAlign:'right'}]}
              value={monthLimit}
              onChangeValue={setMonthLimit}
              delimiter=","
              separator="."
              precision={2}
              placeholder='0.00'
              maxLength={16}
              keyboardType='decimal-pad'
              placeholderTextColor={lightBlue}
            />
          </View>
          <View style={{flex:15, justifyContent:'center',alignItems:'center'}}>
            <Foundation name='dollar' size={34} color={darkBlue}/>
          </View>
        </View>
        {/* <View style={{marginHorizontal:5, flexDirection:'row', justifyContent:'space-evenly'}}>
          <View style={{flex:1.5, justifyContent:'center', alignItems:'center'}}>
            <Text style={{color:darkYellow, fontWeight:'bold'}}>100</Text>
          </View>
          <View style={{flex:9}}>
            <Slider
              value={parseFloat(monthLimit)}
              minimumValue={0}
              maximumValue={10000000000}
              onValueChange={value => {setMonthLimit(value.toString())}}
              step={20}
              minimumTrackTintColor={darkYellow}
              maximumTrackTintColor={lighterBlue}
              thumbStyle={{backgroundColor:darkYellow}}
            />
          </View>
          <View style={{flex:1.5, justifyContent:'center', alignItems:'center'}}>
            <Text style={{color:darkYellow, fontWeight:'bold'}}> 2000</Text>
          </View>
        </View> */}



          {/*********** Day limit ***********/}
        <View style={[styles.noteView]}>
          <View style={{
            flex:50,
            paddingLeft:12,
            justifyContent:'center'
            }}>
            <Text style={styles.dateText}>Day limit</Text>
          </View>
          <View style={{
            flex:80,
            alignItems:'center',
            justifyContent:'center',
            borderBottomColor:darkYellow,
          }}>
            <CurrencyInput
              style={[styles.inputContainer, {textAlign:'right'}]}
              value={dayLimit}
              onChangeValue={setDayLimit}
              delimiter=","
              separator="."
              precision={2}
              placeholder='0.00'
              maxLength={16}
              keyboardType='decimal-pad'
              placeholderTextColor={lightBlue}
            />
          </View>
          <View style={{flex:15, justifyContent:'center',alignItems:'center'}}>
            <Foundation name='dollar' size={34} color={darkBlue}/>
          </View>
        </View>
        {/* <View style={{marginHorizontal:5, flexDirection:'row', justifyContent:'space-evenly'}}>
          <View style={{flex:1.5, justifyContent:'center', alignItems:'center'}}>
            <Text style={{color:darkYellow, fontWeight:'bold'}}>5</Text>
          </View>
          <View style={{flex:9}}>
            <Slider
              value={parseFloat(dayLimit)}
              minimumValue={5}
              maximumValue={200}
              onValueChange={value => {setDayLimit(value.toString())}}
              step={1}
              minimumTrackTintColor={darkYellow}
              maximumTrackTintColor={lighterBlue}
              thumbStyle={{backgroundColor:darkYellow}}
            />
          </View>
          <View style={{flex:1.5, justifyContent:'center', alignItems:'center'}}>
            <Text style={{color:darkYellow, fontWeight:'bold'}}> 200</Text>
          </View>
        </View> */}


        {/*********** Submit button ***********/}
        <View style={[styles.submitButtonView, {alignItems:'center', justifyContent:'center', }]}>
          <TouchableOpacity 
          style={[styles.inputButton, {borderRadius:10, backgroundColor:darkYellow,width:120}]} 
          onPress={() => {onSubmit(); navigation.goBack()}}> 
            <Text style={styles.cancelText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
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
  noteView: {
    flexDirection:'row',
    marginBottom: 6,
    paddingBottom:4,
    paddingTop:4,
    paddingLeft:4,
    borderBottomColor: '#E9E9E9',
    borderTopColor: '#E9E9E9',  
    borderTopWidth:1,      
    //borderBottomWidth:1,    
    height:60 
  },
  dateText: {
    fontSize: 19,
    fontWeight: '600',
    color: darkBlue,
  },
  noteInputContainer: {
    color:darkBlue,
    borderColor: darkBlue,
    paddingRight: 12,
    width:210,
    borderRadius: 10,
    borderBottomWidth:1,
    fontSize: 17,
    fontWeight:'400',
    height: 36,
  },
  inputContainer: {
    backgroundColor: '#FDEE87',
    color: darkBlue,
    borderColor: darkBlue,
    paddingRight: 12,
    width:200,
    borderRadius: 10,
    fontSize: 20,
    fontWeight:'600',
    height: 36,
  },
  submitButtonView: {
    alignItems:'center',
    justifyContent:'center',
    paddingBottom:4,
    paddingTop:4,
    paddingLeft:4,
    borderBottomColor: '#E9E9E9',
    borderTopColor: '#E9E9E9',     
    height:48,
    paddingTop:20
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
  cancelText: {
    fontSize:18,
    color:'#fff',
    fontWeight:'500',
  },
})
export default EditLimitScreen;