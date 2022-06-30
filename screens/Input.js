import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { View, Text, TouchableOpacity, Platform, TextInput, ScrollView, Pressable, Keyboard, StyleSheet, FlatList, Alert} from 'react-native';
import styles from '../components/styles';
import { colors } from '../components/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Entypo, Foundation } from '@expo/vector-icons'
import moment from 'moment';
import { handleExpenseSubmit, handleIncomeSubmit } from '../api/db';
import { StatusBarHeight } from '../components/constants';
import ExpenseCategory from '../CategoriesList/ExpenseCategory';
import IncomeCategory from '../CategoriesList/IncomeCategory';
const { lightYellow, beige, lightBlue, darkBlue, darkYellow } = colors

const Input = ({navigation}) => {
  /********** Bool to switch screens **********/
  const [isIncome, setIsIncome] = useState(false);
  const [isExpense, setIsExpense] = useState(true);
  const openExpense = () => {
    setIsExpense(true);
    setIsIncome(false);
    setChosenCategory('');
  }
  const openIncome = () => {
    setIsExpense(false);
    setIsIncome(true); 
    setChosenCategory('');   
  }

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
  const [amount, setAmount] = useState('');

  /********** Category Variables **********/
  const [chosenCategory, setChosenCategory] = useState('');

  const onPressChoose = () => {

  }
  
  /********** Submit **********/
  const handleExpenseInput = (date, amount, note, chosenCategory) => {
    if (amount != '' && chosenCategory != '') {
      handleExpenseSubmit(date, Number(amount), note, chosenCategory)
      setDate(moment())
      setAmount('')
      setNote('')
      setChosenCategory('')
    } else if (amount == '') {
      Alert.alert("Alert", "Please enter the expense amount", [
        {text: 'Understand', onPress: () => console.log('Alert closed')}
      ]);
    } else if (chosenCategory == '') {
      Alert.alert("Alert", "Please choose the category", [
        {text: 'Understand', onPress: () => console.log('Alert closed')}
      ]);
    }
  }

  const handleIncomeInput = (date, amount, note, chosenCategory) => {
    if (amount != '' && chosenCategory != '') {
      handleIncomeSubmit(date, Number(amount), note, chosenCategory)
      setDate(moment())
      setAmount('')
      setNote('')
      setChosenCategory('')
    } else if (amount == '') {
      Alert.alert("Alert", "Please enter the income amount", [
        {text: 'Understand', onPress: () => console.log('Alert closed')}
      ]);
    } else if (chosenCategory == '') {
      Alert.alert("Alert", "Please choose the category", [
        {text: 'Understand', onPress: () => console.log('Alert closed')}
      ]);
    }
  }

  return (
    <>
    <StatusBar style='dark'/>
      <View style={styless.header}>
        <Text style={styles.boldBlueHeaderText}>Input</Text>
      </View>
      <ScrollView>
        <Pressable onPress={Keyboard.dismiss}>
          <>
            <View style={styles.mainContainerInnerScreen}>
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
                          <TouchableOpacity onPress={()=> {setShow(false), setDate(moment())}}>
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
                  <View style={styless.noteView}>
                    <View style={{
                      flex:22,
                      paddingLeft:12,
                      justifyContent:'center'
                      }}>
                      <Text style={styles.dateText}>Category</Text>
                    </View>
                    <View style={{
                        flex:80,
                        alignItems:'center',
                        justifyContent:'center',
                        borderBottomColor:darkYellow,
                      }}>
                        <Text style={styless.categoryText}>{chosenCategory}</Text>
                    </View>
                  </View>
                  <View style={{height:147}}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={true}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{paddingVertical:5}}>
                      <FlatList
                        scrollEnabled={false}
                        contentContainerStyle={{alignSelf: 'flex-start'}}
                        numColumns={Math.ceil(ExpenseCategory.length / 3)}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={ExpenseCategory}
                        renderItem={({item}) => {
                          if (!item.isEdit) {
                            return (
                              <View style={styless.itemView}>
                                <TouchableOpacity 
                                  style={styless.itemButton}
                                  onPress={() => setChosenCategory(item.name)}>
                                  <Text style={styless.categoryButtonText}>{item.name}</Text>
                                </TouchableOpacity>
                              </View>
                            )
                          }
                          return (
                            <View style={styless.itemView}>
                              <TouchableOpacity 
                                style={styless.itemButton}
                                onPress={() => navigation.navigate('ListOfExpenseCategory')}>
                                <Text style={styless.categoryButtonText}>{item.name}</Text>
                              </TouchableOpacity>
                            </View>
                          )
                          }}/>
                    </ScrollView>
                  </View>
                  <View style={[styless.submitButtonView, {alignItems:'center', justifyContent:'center'}]}>
                    <TouchableOpacity 
                      style={[styles.inputButton, {borderBottomLeftRadius:10, borderTopLeftRadius:10, borderBottomRightRadius:10, borderTopRightRadius:10, backgroundColor:darkYellow,width:120}]} 
                      onPress={() => {handleExpenseInput(date.format('DD-MM-YYYY').toString(), amount, note, chosenCategory)}}>
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
                          <TouchableOpacity onPress={()=> {setShow(false), setDate(moment())}}>
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
                  <View style={styless.noteView}>
                    <View style={{
                      flex:22,
                      paddingLeft:12,
                      justifyContent:'center'
                      }}>
                      <Text style={styles.dateText}>Category</Text>
                    </View>
                    <View style={{
                        flex:80,
                        alignItems:'center',
                        justifyContent:'center',
                        borderBottomColor:darkYellow,
                      }}>
                        <Text style={styless.categoryText}>{chosenCategory}</Text>
                    </View>
                  </View>
                  <View style={{height:147}}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={true}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{paddingVertical:5}}>
                      <FlatList
                        scrollEnabled={false}
                        contentContainerStyle={{alignSelf: 'flex-start'}}
                        numColumns={Math.ceil(IncomeCategory.length / 3)}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={IncomeCategory}
                        renderItem={({item}) => {
                          if (!item.isEdit) {
                            return (
                              <View style={styless.itemView}>
                                <TouchableOpacity 
                                  style={styless.itemButton}
                                  onPress={() => setChosenCategory(item.name)}>
                                  <Text style={styless.categoryButtonText}>{item.name}</Text>
                                </TouchableOpacity>
                              </View>
                            )
                          }
                          return (
                            <View style={styless.itemView}>
                              <TouchableOpacity 
                                style={styless.itemButton}
                                onPress={() => navigation.navigate('ListOfIncomeCategory')}>
                                <Text style={styless.categoryButtonText}>{item.name}</Text>
                              </TouchableOpacity>
                            </View>
                          )
                          }}/>
                    </ScrollView>
                  </View>
                  <View style={[styless.submitButtonView, {alignItems:'center', justifyContent:'center'}]}>
                    <TouchableOpacity 
                    style={[styles.inputButton, {borderBottomLeftRadius:10, borderTopLeftRadius:10, borderBottomRightRadius:10, borderTopRightRadius:10, backgroundColor:darkYellow,width:120}]} 
                    onPress={() => {handleIncomeInput(date.format('DD-MM-YYYY').toString(), amount, note, chosenCategory)}}>
                    <Text style={styles.inputText}>Submit</Text>
                    </TouchableOpacity>
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

export default Input;