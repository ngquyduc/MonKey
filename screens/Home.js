import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { View, Text, TouchableOpacity, Platform, TextInput, ScrollView, Pressable, Keyboard, StyleSheet, FlatList, Alert} from 'react-native';
import styles from '../components/styles';
import { colors } from '../components/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Entypo, Foundation } from '@expo/vector-icons'
import moment from 'moment';
// import MonthPicker from 'react-native-month-year-picker';

import { StatusBarHeight } from '../components/constants';
const { lightYellow, beige, lightBlue, darkBlue, darkYellow } = colors

const Home = ({navigation}) => {
  /********** Bool to switch screens **********/
  const [isMonth, setIsMonth] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);
  const openMonth = () => {
    setIsMonth(true);
    setIsAnnual(false);
    setDate(moment())
    setMonth(moment().format('MMMM YYYY'))
  }
  const openAnnual = () => {
    setIsMonth(false);
    setIsAnnual(true); 
    setDate(moment())
    setYear(moment().format('YYYY'))
  }
  const [isIncome, setIsIncome] = useState(false);
  const [isExpense, setIsExpense] = useState(true);
  const openExpense = () => {
    setIsExpense(true);
    setIsIncome(false);
  }
  const openIncome = () => {
    setIsExpense(false);
    setIsIncome(true); 

  }

  /********** Date Picker Variables **********/
  let [date, setDate] = useState(moment());
  let [month, setMonth] = useState(moment().format('MMMM YYYY'));
  let [year, setYear] = useState(moment().format('YYYY'))
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    setDate(moment(selectedDate))
    setMonth(moment(selectedDate).format('MMMM YYYY'))
  }

  const addOneMonth = () => {
    setDate(moment(date).add(1, 'month'))
    setMonth(moment(date).add(1, 'month').format('MMMM YYYY'))
  }

  const addOneYear = () => {
    setDate(moment(date).add(1, 'year'));
    setYear(moment(date).add(1, 'year').format('YYYY'))
  }

  const subtractOneMonth = () => {
    setDate(moment(date).subtract(1, 'month'))
    setMonth(moment(date).subtract(1, 'month').format('MMMM YYYY'))
  }

  const subtractOneYear = () => {
    setDate(moment(date).subtract(1, 'year'))
    setYear(moment(date).subtract(1, 'year').format('YYYY'))
  }

  return (
    <>
    <StatusBar style='dark'/>
      <View style={styless.header}>
        <Text style={styles.boldBlueHeaderText}>Home</Text>
      </View>
      <ScrollView>
        <Pressable onPress={Keyboard.dismiss}>
          <>
            <View style={styles.mainContainerInnerScreen}>
              <View style={styless.expenseInputButtonView}>
                <View style={{flex:0.5}}>
                  <TouchableOpacity 
                    style={[styles.inputButton, {
                      borderBottomLeftRadius:10, 
                      borderTopLeftRadius:10, 
                      backgroundColor:isMonth?darkBlue:lightBlue}]} 
                    onPress={openMonth}>
                    <Text style={styles.inputText}>
                      Monthly
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{flex:0.5}}>
                  <TouchableOpacity 
                    style={[styles.inputButton, {
                      borderBottomRightRadius:10,
                      borderTopRightRadius:10, 
                      backgroundColor:isAnnual?darkBlue:lightBlue}]} 
                    onPress={openAnnual}>
                    <Text style={styles.inputText}>
                      Annually
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/********** Main Screens (Expense) **********/}
              {isMonth && (
                <View>
                  <View style={styless.dateView}>
                    <View style={{
                      flex:20,
                      paddingLeft:12,
                      justifyContent:'center'}}>
                      <Text style={styles.dateText}>
                        Month
                      </Text>
                    </View>
                    <View style={{
                      flex:15,
                      alignItems:'center',
                      justifyContent:'center'
                      }}>
                      <TouchableOpacity style={{position: 'absolute'}} 
                        onPress={subtractOneMonth}>
                        <Entypo name='chevron-left' size={28} color={darkBlue}/>
                      </TouchableOpacity>
                    </View>
                    <View style={styless.datePickerView}>
                      <TouchableOpacity onPress={()=>setShow(true)}>
                        <View>
                          <Text style={styles.dateText}>{month}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{
                      flex:15,
                      alignItems:'center',
                      justifyContent:'center'
                    }}>
                      {/************ Add function for these 2 buttons *************/}
                      <TouchableOpacity style={{position: 'absolute'}} 
                        onPress={addOneMonth}>
                        <Entypo name='chevron-right' size={28} color={darkBlue}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {show && (
                    <>
                      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', paddingTop:10, paddingLeft:20, paddingRight:20}}>
                        <View style={{flex:5}}>
                          <TouchableOpacity onPress={()=> {setShow(false), setDate(moment())}}>
                            <View>
                              <Text style={styles.datePickerOffText}>
                                Cancel
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={{flex:5, alignItems:'flex-end'}}>
                          <TouchableOpacity onPress={()=> setShow(false)}>
                            <View>
                              <Text style={styles.datePickerOffText}>
                                Done
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={{
                        borderBottomColor: '#E9E9E9',
                      }}>
                        <DateTimePicker
                          value={new Date(date)}
                          display={'spinner'}
                          onChange ={onChange}
                        />
                      </View>
                    </>
                  )}
                </View>)}

              {/********** Main Screens (Income) **********/}
              {isAnnual && (
                <View>
                  <View style={styless.dateView}>
                    <View style={{
                      flex:20,
                      paddingLeft:12,
                      justifyContent:'center'
                    }}>
                      <Text style={styles.dateText}>Year</Text>
                    </View>
                    <View style={{
                      flex:15,
                      alignItems:'center',
                      justifyContent:'center'
                    }}>
                      {/************ Add function for these 2 buttons *************/}
                      <TouchableOpacity style={{position: 'absolute'}} onPress={subtractOneYear}>
                        <Entypo name='chevron-left' size={28} color={darkBlue}/>
                      </TouchableOpacity>
                    </View>
                    <View style={styless.datePickerView}>            
                        <Text style={styles.dateText}>{date.format('YYYY')}</Text>
                    </View>
                    <View style={{
                      flex:15,
                      alignItems:'center',
                      justifyContent:'center'
                    }}>
                      {/************ Add function for these 2 buttons *************/}
                      <TouchableOpacity style={{position: 'absolute'}} onPress={addOneYear}>
                        <Entypo name='chevron-right' size={28} color={darkBlue}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                )}
            </View>
            </>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styless = StyleSheet.create({
  header: {
    alignItems:'center', 
    justifyContent:'flex-end',
    backgroundColor:'#fff',
    borderBottomColor:'#808080',
    borderBottomWidth:1,
    paddingTop:3,
    height: StatusBarHeight + 48,
  },
  expenseInputButtonView: {
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
    height:60,
    paddingLeft:40,
    paddingRight:40
  },
  dateView: {
    flexDirection:'row',
    paddingBottom:7,
    paddingTop:7,
    paddingLeft:4,
    borderBottomColor: '#E9E9E9',
    borderTopColor: '#E9E9E9',
    borderTopWidth:1,            
    height:48
  },
  datePickerView: {
    flex:55,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#FDEE87',
    borderRadius:10
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
  submitButtonView: {
    flexDirection:'row',
    paddingBottom:4,
    paddingTop:4,
    paddingLeft:4,
    borderBottomColor: '#E9E9E9',
    borderTopColor: '#E9E9E9',     
    height:48
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
  submitButton: {
    padding: 5,
    height: 40,
    width:100,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius:10, 
    borderTopLeftRadius:10, 
    borderBottomRightRadius:10,
    borderTopRightRadius:10,
    backgroundColor:darkYellow
  },
  itemView: {
    alignItems:'center',
    justifyContent:'center',
    height: 46,
    width:150, 
  },
  itemButton: {
    flexDirection: 'row',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius:10, 
    borderBottomRightRadius:10,
    borderTopLeftRadius:10, 
    borderTopRightRadius:10, 
    backgroundColor:lightYellow,
    width:120
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '500',
    color: darkBlue,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: darkBlue,
  }
})



export default Home;