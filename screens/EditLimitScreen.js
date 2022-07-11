import React, {useState, useEffect} from 'react'
import MainContainer from '../components/Containers/Main';
import KeyboardAvoidingContainer from '../components/Containers/KeyboardAvoiding';
import { Text, View, Alert, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Feather, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBarHeight } from '../components/constants';
import TextInputWithIcon from '../components/Containers/TextInputWithIcon';
import { colors } from '../components/colors';
import {Slider} from '@miblanchard/react-native-slider';
const { lightYellow, lighterBlue, lightBlue, darkBlue, darkYellow } = colors


const EditLimitScreen = ({navigation}) => {
  const [monthLimit, setMonthLimit] = useState('700'); // need to store on Firestore
  const [dayLimit, setDayLimit] = useState('40'); // need to store on Firestore
  const onSubmit = (limitMonth, limitDay) => {
  }
  return (
    <View style={{backgroundColor:'#fff', flex:1}}>
      {/*********** Header ***********/}
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
          <TextInput
            style={[styles.inputContainer, {textAlign:'right'}]}
            maxLength={10}
            placeholder='0'
            placeholderTextColor={lightBlue}
            keyboardType='decimal-pad'
            value={monthLimit}
            onChangeText={(value) => setMonthLimit(value)}
          />
        </View>
        <View style={{flex:15, justifyContent:'center',alignItems:'center'}}>
          <Foundation name='dollar' size={34} color={darkBlue}/>
        </View>
      </View>
      <View style={{marginHorizontal:5, flexDirection:'row', justifyContent:'space-evenly'}}>
        <View style={{flex:1.5, justifyContent:'center', alignItems:'center'}}>
          <Text style={{color:darkYellow, fontWeight:'bold'}}>100</Text>
        </View>
        <View style={{flex:9}}>
          <Slider
            value={parseFloat(monthLimit)}
            minimumValue={100}
            maximumValue={2000}
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
      </View>



        {/*********** Day limit ***********/}
      <View style={styles.noteView}>
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
          <TextInput
            style={[styles.inputContainer, {textAlign:'right'}]}
            maxLength={10}
            placeholder='0'
            placeholderTextColor={lightBlue}
            keyboardType='decimal-pad'
            value={dayLimit}
            onChangeText={(value) => setDayLimit(value)}
          />
        </View>
        <View style={{flex:15, justifyContent:'center',alignItems:'center'}}>
          <Foundation name='dollar' size={34} color={darkBlue}/>
        </View>
      </View>
      <View style={{marginHorizontal:5, flexDirection:'row', justifyContent:'space-evenly'}}>
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
      </View>


      {/*********** Submit button ***********/}
      <View style={[styles.submitButtonView, {alignItems:'center', justifyContent:'center', }]}>
        <TouchableOpacity 
        style={[styles.inputButton, {borderRadius:10, backgroundColor:darkYellow,width:120}]} 
        onPress={() => {onSubmit(parseFloat(monthLimit), parseFloat(dayLimit)); navigation.goBack()}}> 
          <Text style={styles.cancelText}>Submit</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom:4,
    paddingTop:4,
    paddingLeft:4,
    borderBottomColor: '#E9E9E9',
    borderTopColor: '#E9E9E9',  
    borderTopWidth:1,      
    //borderBottomWidth:1,    
    height:48
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