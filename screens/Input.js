import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, Platform, Button, TextInput, TouchableWithoutFeedback, Keyboard, StyleSheet} from 'react-native';
import styles from '../components/styles';
import { colors } from '../components/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Entypo, Foundation } from '@expo/vector-icons'
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
const { lightYellow, beige, lightBlue, darkBlue, darkYellow } = colors

const Input = () => {
  /********** Bool to switch screens **********/
  const [isIncome, setIsIncome] = useState(true);
  const [isExpense, setIsExpense] = useState(false);
  const openExpense = () => {
    setIsExpense(true);
    setIsIncome(false);
  }
  const openIncome = () => {
    setIsExpense(false);
    setIsIncome(true);    
  }
  const [isUnderlined, setIsUnderlined] = useState(false);

  /********** Date Picker Variables **********/
  let [date, setDate] = useState(moment());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    setDate(moment(selectedDate))
  }

  const addOneDay = () => {
    date = setDate(moment(date).add(1, 'day'));
  }

  const subtractOneDay = () => {
    date = setDate(moment(date).subtract(1, 'day'));
  }


  /********** Note Variables **********/
  const [note, setNote] = useState('');

  /********** Expense Variables **********/
  const [amount, setAmount] = useState(0);

  /********** Submit **********/
  const handleExpenseSubmit = (amount, date, note, category) => {
    //call back end
  }

  const handleIncomeSubmit = (amount, date, note, category) => {
    //call back end
  }

  const onPress = ()=> {
    Keyboard.dismiss();
    setIsUnderlined(false);
  }
  return (
    <TouchableWithoutFeedback onPress={onPress}>
    <SafeAreaView style={{flex:1}} edges={'top'}>
        {/********** Need to change color of status bar **********/}
        <StatusBar style='dark'/>
        <View style={styles.mainContainerInnerScreen}>
          <View style={styless.header}>
            <Text style={styles.boldBlueHeaderText}>Input</Text>
          </View>
          <View style={styless.expenseInputButtonView}>
            <View style={{flex:0.5}}>
              <TouchableOpacity 
                style={[styles.inputButton, {borderBottomLeftRadius:10, borderTopLeftRadius:10, backgroundColor:isExpense?darkBlue:lightBlue}]} 
                onPress={openExpense}>
                <Text style={styles.inputText}>Expense</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex:0.5}}>
              <TouchableOpacity 
                style={[styles.inputButton, {borderBottomRightRadius:10, borderTopRightRadius:10, backgroundColor:isIncome?darkBlue:lightBlue}]} 
                onPress={openIncome}>
                <Text style={styles.inputText}>Income</Text>
              </TouchableOpacity>
            </View>
          </View>



          {/********** Main Screens (Expense) **********/}
          {isExpense && (
            <View>
              <View style={styless.dateView}>
                <View style={{
                  flex:20,
                  paddingLeft:12,
                  justifyContent:'center'
                }}>
                  <Text style={styles.dateText}>Date</Text>
                </View>
                <View style={{
                  flex:15,
                  alignItems:'center',
                  justifyContent:'center'
                }}>
                  {/************ Add function for these 2 buttons *************/}
                  <TouchableOpacity style={{position: 'absolute'}} onPress={subtractOneDay}>
                    <Entypo name='chevron-left' size={28} color={darkBlue}/>
                  </TouchableOpacity>
                </View>
                <View style={styless.datePickerView}>
                  <TouchableOpacity onPress={()=>setShow(true)}>
                    <View>
                      <Text style={styles.dateText}>{date.format('MMMM Do, YYYY')}</Text>
                    </View>
                  </TouchableOpacity>

                  {/* <Button title={fDate} onPress={()=>showMode('date')}/> */}
                </View>
                <View style={{
                  flex:15,
                  alignItems:'center',
                  justifyContent:'center'
                }}>
                  {/************ Add function for these 2 buttons *************/}
                  <TouchableOpacity style={{position: 'absolute'}} onPress={addOneDay}>
                    <Entypo name='chevron-right' size={28} color={darkBlue}/>
                  </TouchableOpacity>
                </View>
              </View>
              {show && (
                <>
                  <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', paddingTop:10, paddingLeft:20, paddingRight:20}}>
                    <View style={{flex:5}}>
                      <TouchableOpacity onPress={()=> {setShow(false), setDate(new Date())}}>
                        <View>
                          <Text style={styles.datePickerOffText}>Cancel</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{flex:5, alignItems:'flex-end'}}>
                      <TouchableOpacity onPress={()=> setShow(false)}>
                        <View>
                          <Text style={styles.datePickerOffText}>Done</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{
                    borderBottomColor: '#E9E9E9',
                    borderBottomWidth:1,
                  }}>
                    <DateTimePicker
                      value={new Date(date)}
                      is24Hour={true}
                      display='spinner'
                      onChange ={onChange}
                      minimumDate={new Date(moment().subtract(50, 'years').format('YYYY-MM-DD'))}
                      maximumDate={new Date(moment().add(50, 'years').format('YYYY-MM-DD'))}
                    />
                  </View>
                </>
              )}

              <View style={styless.dateView}>
                <View style={{
                  flex:30,
                  paddingLeft:12,
                  justifyContent:'center'
                  }}>
                  <Text style={styles.dateText}>Expense</Text>
                </View>
                <View style={{
                  flex:5,
                  }}></View>
                <View style={styless.datePickerView}>
                  <TextInput
                    style={[styless.inputContainer, {textAlign:'right'}]}
                    placeholder='0.00'
                    placeholderTextColor={lightBlue}
                    keyboardType='decimal-pad'
                    value={amount}
                    onChangeText={(value) => setAmount(value)}
                  />
                </View>
                <View style={{
                  flex:15, 
                  justifyContent:'center',
                  alignItems:'center'
                  }}>
                    <Foundation name='dollar' size={34} color={darkBlue}/>
                </View>
              </View>
              <View style={styless.noteView}>
                <View style={{
                  flex:20,
                  paddingLeft:12,
                  justifyContent:'center'
                  }}>
                  <Text style={styles.dateText}>Note</Text>
                </View>
                <View style={{
                  flex:80,
                  alignItems:'center',
                  justifyContent:'center',
                  borderBottomWidth:isUnderlined?2:0,
                  borderBottomColor:darkYellow,
                }}>
                  <TextInput
                    style={[styless.noteInputContainer, {textAlign:'left'}]}
                    placeholder='Note'
                    placeholderTextColor={lightBlue}
                    value={note}
                    onChangeText={(value) => setNote(value)}
                  />
                </View>
              </View>
              <View style={[styless.noteView, {alignItems:'center', justifyContent:'center'}]}>
                <TouchableOpacity 
                  style={[styles.inputButton, {borderBottomLeftRadius:10, borderTopLeftRadius:10, borderBottomRightRadius:10, borderTopRightRadius:10, backgroundColor:darkYellow,width:120}]} 
                  onPress={handleExpenseSubmit}>
                  <Text style={styles.inputText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>)}




          {/********** Main Screens (Income) **********/}
          {isIncome && (
            <View>
              <View style={styless.dateView}>
                <View style={{
                  flex:20,
                  paddingLeft:12,
                  justifyContent:'center'
                }}>
                  <Text style={styles.dateText}>Date</Text>
                </View>
                <View style={{
                  flex:15,
                  alignItems:'center',
                  justifyContent:'center'
                }}>
                  {/************ Add function for these 2 buttons *************/}
                  <TouchableOpacity style={{position: 'absolute'}} onPress={subtractOneDay}>
                    <Entypo name='chevron-left' size={28} color={darkBlue}/>
                  </TouchableOpacity>
                </View>
                <View style={styless.datePickerView}>
                  <TouchableOpacity onPress={()=>setShow(true)}>
                    <View>
                      <Text style={styles.dateText}>{date.format('MMMM Do, YYYY')}</Text>
                    </View>
                  </TouchableOpacity>

                  {/* <Button title={fDate} onPress={()=>showMode('date')}/> */}
                </View>
                <View style={{
                  flex:15,
                  alignItems:'center',
                  justifyContent:'center'
                }}>
                  {/************ Add function for these 2 buttons *************/}
                  <TouchableOpacity style={{position: 'absolute'}} onPress={addOneDay}>
                    <Entypo name='chevron-right' size={28} color={darkBlue}/>
                  </TouchableOpacity>
                </View>
              </View>
              {show && (
                <>
                  <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', paddingTop:10, paddingLeft:20, paddingRight:20}}>
                    <View style={{flex:5}}>
                      <TouchableOpacity onPress={()=> {setShow(false), setDate(new Date())}}>
                        <View>
                          <Text style={styles.datePickerOffText}>Cancel</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={{flex:5, alignItems:'flex-end'}}>
                      <TouchableOpacity onPress={()=> setShow(false)}>
                        <View>
                          <Text style={styles.datePickerOffText}>Done</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{
                    borderBottomColor: '#E9E9E9',
                    borderBottomWidth:1,
                  }}>
                    <DateTimePicker
                      value={new Date(date)}
                      display='spinner'
                      onChange ={onChange}
                      minimumDate={new Date(moment().subtract(50, 'years').format('YYYY-MM-DD'))}
                      maximumDate={new Date(moment().add(50, 'years').format('YYYY-MM-DD'))}
                    />
                  </View>
                </>
              )}
              <View style={styless.dateView}>
                <View style={{
                  flex:30,
                  paddingLeft:12,
                  justifyContent:'center'
                  }}>
                  <Text style={styles.dateText}>Income</Text>
                </View>
                <View style={{
                  flex:5,
                  }}></View>
                <View style={styless.datePickerView}>
                  <TextInput
                    style={[styless.inputContainer, {textAlign:'right'}]}
                    placeholder='0.00'
                    placeholderTextColor={lightBlue}
                    keyboardType='decimal-pad'
                    value={amount}
                    onChangeText={(value) => setAmount(value)}
                  />
                </View>
                <View style={{
                  flex:15, 
                  justifyContent:'center',
                  alignItems:'center'
                  }}>
                    <Foundation name='dollar' size={34} color={darkBlue}/>
                </View>
              </View>
              <View style={styless.noteView}>
                <View style={{
                  flex:20,
                  paddingLeft:12,
                  justifyContent:'center'
                  }}>
                  <Text style={styles.dateText}>Note</Text>
                </View>
                <View style={{
                    flex:80,
                    alignItems:'center',
                    justifyContent:'center',
                    borderBottomWidth:isUnderlined?2:0,
                    borderBottomColor:darkYellow,
                  }}>
                    <TextInput
                      style={[styless.noteInputContainer, {textAlign:'left'}]}
                      placeholder='Note'
                      placeholderTextColor={lightBlue}
                      value={note}
                      onChangeText={(value) => setNote(value)}
                    />
                </View>
              </View>
              <View style={[styless.noteView, {alignItems:'center', justifyContent:'center'}]}>
                <TouchableOpacity 
                  style={[styles.inputButton, {borderBottomLeftRadius:10, borderTopLeftRadius:10, borderBottomRightRadius:10, borderTopRightRadius:10, backgroundColor:darkYellow,width:120}]} 
                  onPress={handleIncomeSubmit}>
                  <Text style={styles.inputText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
            )}
        </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styless = StyleSheet.create({
  header: {
    alignItems:'center', 
    backgroundColor:beige,
    borderBottomColor:'#808080',
    borderBottomWidth:1,
    paddingTop:3,
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
    height:52
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
    borderBottomWidth:1,    
    height:52
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
  }
})

export default Input;