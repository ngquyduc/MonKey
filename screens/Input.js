import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { View, Text, TouchableOpacity, Platform, Button, TextInput, TouchableWithoutFeedback, Keyboard, StyleSheet} from 'react-native';
import styles from '../components/styles';
import { colors } from '../components/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Entypo, Foundation } from '@expo/vector-icons'
import moment from 'moment';
const { lightYellow, beige, lightBlue, darkBlue, darkYellow } = colors

const Input = ({ navigation }) => {
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

  /********** Date Picker Variables **********/
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const showMode = (currenMode) => {
    setShow(true);
    setMode(currenMode);
  } 
  let fDate = date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(Platform.OS === 'ios');
    setDate(currentDate)

    let tempDate = new Date(currentDate);
    let formatDate = tempDate.getDate() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getFullYear();
    console.log(formatDate)
  }

  /********** Note Variables **********/


  /********** Expense Variables **********/
  const [expense, setExpense] = useState(0);
  const [income, setIncome] = useState(0);
  /********** Submit **********/
  const handleExpenseSubmit = () => {
    //call back end
  }

  const handleIncomeSubmit = () => {
    //call back end
  }


  return (
    <>
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
                <TouchableOpacity style={{position: 'absolute'}}>
                  <Entypo name='chevron-left' size={28} color={darkBlue}/>
                </TouchableOpacity>
              </View>
              <View style={styless.datePickerView}>
                <TouchableOpacity onPress={()=>setShow(true)}>
                  <View>
                    <Text style={styles.dateText}>{fDate}</Text>
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
                <TouchableOpacity style={{position: 'absolute'}}>
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
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display='spinner'
                    onChange ={onChange}
                    minimumDate={new Date(moment().subtract(50, 'years').format('YYYY-MM-DD'))}
                    maximumDate={new Date(moment().format('YYYY-MM-DD'))}
                  />
                </View>
              </>
            )}
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
                justifyContent:'center'
              }}>
              </View>
            </View>
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
                  value={expense}
                  onChangeText={(value) => setExpense(value)}
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
                <TouchableOpacity style={{position: 'absolute'}}>
                  <Entypo name='chevron-left' size={28} color={darkBlue}/>
                </TouchableOpacity>
              </View>
              <View style={styless.datePickerView}>
                <TouchableOpacity onPress={()=>setShow(true)}>
                  <View>
                    <Text style={styles.dateText}>{fDate}</Text>
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
                <TouchableOpacity style={{position: 'absolute'}}>
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
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display='spinner'
                    onChange ={onChange}
                    minimumDate={new Date(moment().subtract(50, 'years').format('YYYY-MM-DD'))}
                    maximumDate={new Date(moment().format('YYYY-MM-DD'))}
                  />
                </View>
              </>
            )}
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
                justifyContent:'center'
              }}>
              </View>
            </View>
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
                  value={income}
                  onChangeText={(value) => setIncome(value)}
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
            <View style={[styless.noteView, {alignItems:'center', justifyContent:'center'}]}>
              <TouchableOpacity 
                style={[styles.inputButton, {borderBottomLeftRadius:10, borderTopLeftRadius:10, borderBottomRightRadius:10, borderTopRightRadius:10, backgroundColor:darkYellow,width:120}]} 
                onPress={handleIncomeSubmit}>
                <Text style={styles.inputText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>)}
      </View>
    </>
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
    flexDirection:'row',
    height:70,
    paddingTop:15,
    paddingLeft:40,
    paddingRight:40
  },
  dateView: {
    flexDirection:'row',
    paddingBottom:8,
    paddingTop:8,
    paddingLeft:4,
    borderBottomColor: '#E9E9E9',
    borderTopColor: '#E9E9E9',
    borderBottomWidth:1,
    borderTopWidth:1,            
    height:60
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
    height:60
  },
  inputContainer: {
    backgroundColor: '#FDEE87',
    color: darkBlue,
    borderColor: darkBlue,
    padding: 15,
    width:200,
    borderRadius: 10,
    fontSize: 20,
    fontWeight:'600',
    height: 44,
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