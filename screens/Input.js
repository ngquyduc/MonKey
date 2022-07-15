import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, Platform, TextInput, ScrollView, Pressable, Keyboard, StyleSheet, FlatList, Alert, Modal, TouchableWithoutFeedback} from 'react-native';
import styles from '../components/styles';
import { colors } from '../components/colors';
import { Snackbar } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScreenWidth } from '../components/constants';
import { Entypo, Foundation, MaterialCommunityIcons } from '@expo/vector-icons'
import moment from 'moment';
import { handleExpenseSubmit, handleIncomeSubmit } from '../api/db';
import { StatusBarHeight } from '../components/constants';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../api/db";
import { getUserID } from '../api/authentication';
import CurrencyInput from 'react-native-currency-input';

const { lightYellow, beige, lightBlue, darkBlue, darkYellow, lighterBlue } = colors


const Input = ({navigation}) => {
  /********** Bool to switch screens **********/
  const [isIncome, setIsIncome] = useState(false);
  const [isExpense, setIsExpense] = useState(true);
  const openExpense = () => {
    setIsExpense(true);
    setIsIncome(false);
    setChosenCategory('');
    setColor('');
  }
  const openIncome = () => {
    setIsExpense(false);
    setIsIncome(true); 
    setChosenCategory('');  
    setColor(''); 
  }
  /********** SnackBar Variables **********/
  const [visibleExpense, setVisibleExpense] = useState(false)
  const [visibleIncome, setVisibleIncome] = useState(false)
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
  const [amount, setAmount] = useState('')

  /********** Category Variables **********/
  const [chosenCategory, setChosenCategory] = useState('');
  const [colorC, setColor] = useState('');
  const onPressChoose = () => {
  }

  /********** Submit **********/
  
  const handleExpenseInput = (date, amount, note, chosenCategory) => {
    if (amount == null || amount == 0) {
      Alert.alert("Alert", "Please enter the expense amount", [
        {text: 'Understand', onPress: () => console.log('Alert closed')}
      ]);
    } else if (chosenCategory == '') {
      Alert.alert("Alert", "Please choose the category", [
        {text: 'Understand', onPress: () => console.log('Alert closed')}
      ]);
    } else if (amount != '' && chosenCategory != '') {
      handleExpenseSubmit(date, amount, note, chosenCategory)
      setVisibleExpense(true)
      setDate(moment())
      setAmount('')
      setNote('')
      setChosenCategory('')
      setColor('');
    } 
  }

  const handleIncomeInput = (date, amount, note, chosenCategory) => {
    if (amount == null || amount == 0) {
      Alert.alert("Alert", "Please enter the expense amount", [
        {text: 'Understand', onPress: () => console.log('Alert closed')}
      ]);
    } else if (chosenCategory == '') {
      Alert.alert("Alert", "Please choose the category", [
        {text: 'Understand', onPress: () => console.log('Alert closed')}
      ]);
    } else if (amount != '' && chosenCategory != '') {
      handleIncomeSubmit(date, amount, note, chosenCategory)
      setVisibleExpense(true)
      setDate(moment())
      setAmount('')
      setNote('')
      setChosenCategory('')
      setColor('');
    } 
  }

  const [ExpenseCategory, setExpenseCategory] = useState([])
  const [IncomeCategory, setIncomeCategory] = useState([])
  useEffect(() => {
    const expenseCategoryRef = collection(db, 'Input Category/Expense/' + getUserID())
    onSnapshot(expenseCategoryRef, (snapshot) => {
      const expenseCategories = [];
      snapshot.forEach((doc) => {
          expenseCategories.push({
            name: doc.data().name,
            color: doc.data().color,
            icon: doc.data().icon,
            isEdit: doc.data().name == 'Edit' ? true : false
          });
      });
      expenseCategories.sort((a, b) => a.name == 'Edit' ? 1 : b.name == 'Edit' ? -1 : a.name > b.name ? 1 : -1)
      setExpenseCategory(expenseCategories)
    });

    const incomeCategoryRef = collection(db, 'Input Category/Income/' + getUserID())
    onSnapshot(incomeCategoryRef, (snapshot) => {
      const incomeCategories = [];
      snapshot.forEach((doc) => {
          incomeCategories.push({
            name: doc.data().name,
            color: doc.data().color,
            icon: doc.data().icon,
            isEdit: doc.data().name == 'Edit' ? true : false
          });
      });
      incomeCategories.sort((a, b) => a.name == 'Edit' ? 1 : b.name == 'Edit' ? -1 : a.name > b.name ? 1 : -1)
      setIncomeCategory(incomeCategories)
    });}
  , [])

  

  return (
    <>
    <View style={{flex:1, backgroundColor:'#fff'}}>
      <View style={[styless.header, {marginBottom:4}]}>
        <Text style={styles.boldBlueHeaderText}>Input</Text>
      </View>
      <View>
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
                  <Modal 
                    visible={show}
                    transparent={true}
                    animationType='fade'
                    style={{backgroundColor:'#fff'}}
                  >
                    <View style={styless.modalView}>
                      <View style={{backgroundColor:'#fff', width:'100%', paddingVertical:15, borderTopRightRadius:20, borderTopLeftRadius:20}}>
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
                            textColor={darkBlue}
                            display='spinner'
                            onChange ={onChange}
                            minimumDate={new Date(moment().subtract(50, 'years').format('YYYY-MM-DD'))}
                            maximumDate={new Date(moment().add(50, 'years').format('YYYY-MM-DD'))}
                          />
                        </View>
                      </View>
                    </View>
                  </Modal>

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
                      <CurrencyInput
                        style={[styless.inputContainer, {textAlign:'right'}]}
                        value={amount}
                        onChangeValue={setAmount}
                        delimiter=","
                        separator="."
                        precision={2}
                        placeholder='0.00'
                        maxLength={16}
                        keyboardType='decimal-pad'
                        placeholderTextColor={'#49494950'}
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
                        multiline={true}
                        scrollEnabled={true}
                        style={[styless.noteInputContainer, {textAlign:'left'}]}
                        placeholder='Note (optional)'
                        placeholderTextColor={'#49494950'}
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
                        <Text style={[styless.categoryText, {color:colorC}]}>{chosenCategory}</Text>
                    </View>
                  </View>
                  <View style={{height:280, alignItems:'center', marginBottom: 10}}>
                    <FlatList
                      scrollEnabled={true}
                      contentContainerStyle={{alignSelf: 'flex-start'}}
                      numColumns={3}
                      showsVerticalScrollIndicator={true}
                      data={ExpenseCategory}
                      renderItem={({item}) => {
                        if (!item.isEdit) {
                          return (
                            <View style={styless.itemView}>
                              <TouchableOpacity 
                                style={styless.itemButton}
                                onPress={() => {setChosenCategory(item.name); setColor(item.color)}}>
                                <MaterialCommunityIcons name={item.icon} size={20} color={item.color}/>
                                <Text ellipsizeMode='tail' numberOfLines={1}style={[styless.categoryButtonText]}>{' ' + item.name}</Text>
                              </TouchableOpacity>
                            </View>
                          )
                        }
                        return (
                          <View style={styless.itemView}>
                            <TouchableOpacity 
                              style={[styless.itemButton, {backgroundColor:darkBlue, paddingLeft:7, flexDirection:'row'}]}
                              onPress={() => navigation.navigate('ListOfExpenseCategory')}>
                              <Text style={[styless.categoryButtonText, {fontWeight: '500', color:'#fff'}]}>{item.name}</Text>
                              <MaterialCommunityIcons name='chevron-right' size={25} color='#fff'/>
                            </TouchableOpacity>
                          </View>
                        )
                        }}/>
                  </View>
                  <View style={[styless.submitButtonView, {alignItems:'center', justifyContent:'center'}]}>
                    <TouchableOpacity 
                      style={[styles.inputButton, {borderBottomLeftRadius:10, borderTopLeftRadius:10, borderBottomRightRadius:10, borderTopRightRadius:10, backgroundColor:darkBlue,width:200}]} 
                      onPress={() => {handleExpenseInput(date.format('YYYY-MM-DD').toString(), amount, note, chosenCategory)}}>
                      <Text style={styles.inputText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}




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
                  <Modal 
                    visible={show}
                    transparent={true}
                    animationType='fade'
                    style={{backgroundColor:'#fff'}}
                  >
                    <View style={styless.modalView}>
                      <View style={{backgroundColor:'#fff', width:'100%', paddingVertical:15, borderTopRightRadius:20, borderTopLeftRadius:20}}>
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
                            textColor={darkBlue}
                            onChange ={onChange}
                            minimumDate={new Date(moment().subtract(50, 'years').format('YYYY-MM-DD'))}
                            maximumDate={new Date(moment().add(50, 'years').format('YYYY-MM-DD'))}
                          />
                        </View>
                      </View>
                    </View>
                  </Modal>
                  <View style={styless.dateView}>
                    <View style={{
                      flex:30,
                      paddingLeft:12,
                      justifyContent:'center'
                      }}>
                      <Text style={styles.dateText}>Income</Text>
                    </View>
                    <View style={{flex:5}}></View>
                    <View style={styless.datePickerView}>
                      <CurrencyInput
                        style={[styless.inputContainer, {textAlign:'right'}]}
                        value={amount}
                        onChangeValue={setAmount}
                        delimiter=","
                        separator="."
                        precision={2}
                        placeholder='0.00'
                        maxLength={16}
                        keyboardType='decimal-pad'
                        placeholderTextColor={'#49494950'}
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
                        multiline={true}
                        scrollEnabled={true}
                        style={[styless.noteInputContainer, {textAlign:'left'}]}
                        placeholder='Note (optional)'
                        placeholderTextColor={'#49494950'}
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
                        <Text style={[styless.categoryText, {color:colorC}]}>{chosenCategory}</Text>
                    </View>
                  </View>
                  <View style={{height:280, alignItems:'center', marginBottom: 10}}>
                    <FlatList
                      scrollEnabled={true}
                      contentContainerStyle={{alignSelf: 'flex-start'}}
                      numColumns={3}
                      showsVerticalScrollIndicator={true}
                      data={IncomeCategory}
                      renderItem={({item}) => {
                        if (!item.isEdit) {
                          return (
                            <View style={styless.itemView}>
                              <TouchableOpacity 
                                style={styless.itemButton}
                                onPress={() => {setChosenCategory(item.name); setColor(item.color)}}>
                                <MaterialCommunityIcons name={item.icon} size={20} color={item.color}/>
                                <Text ellipsizeMode='tail' numberOfLines={1} style={[styless.categoryButtonText]}>{' ' + item.name}</Text>
                              </TouchableOpacity>
                            </View>
                          )
                        }
                        return (
                          <View style={styless.itemView}>
                            <TouchableOpacity 
                              style={[styless.itemButton, {backgroundColor:darkBlue, paddingLeft:7, flexDirection:'row'}]}
                              onPress={() => navigation.navigate('ListOfIncomeCategory')}>
                              <Text style={[styless.categoryButtonText, {color:'#fff', fontWeight: '500'}]}>{item.name}</Text>
                              <MaterialCommunityIcons name='chevron-right' size={25} color='#fff'/>
                            </TouchableOpacity>
                          </View>
                        )
                    }}/>
                  </View>
                  <View style={[styless.submitButtonView, {alignItems:'center', justifyContent:'center'}]}>
                    <TouchableOpacity 
                    style={[styles.inputButton, {borderBottomLeftRadius:10, borderTopLeftRadius:10, borderBottomRightRadius:10, borderTopRightRadius:10, backgroundColor:darkBlue,width:200}]} 
                    onPress={() => {handleIncomeInput(date.format('YYYY-MM-DD').toString(), amount, note, chosenCategory)}}>
                      <Text style={styles.inputText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                )}
              
            </View>
            
          </>
        </Pressable>
        
      </View>
      
    </View>
    <View style={{justifyContent:'flex-end'}}>
    <Snackbar
      visible={visibleIncome}
      onDismiss={()=>setVisibleIncome(false)}
      action={{
        label: 'Close',
        onPress: () => {
          // Do something
        },
      }}
      duration={1000}>
      Income noted!
    </Snackbar>
    <Snackbar
        visible={visibleExpense}
        onDismiss={()=>setVisibleExpense(false)}
        action={{
          label: 'Close',
          onPress: () => {
            // Do something
          },
        }}
        duration={1000}>
        Expense noted!
      </Snackbar>
    </View>
  </>
  );
}

const styless = StyleSheet.create({
  header: {
    alignItems:'center', 
    justifyContent: 'flex-end',
    backgroundColor:'#fff',
    borderBottomColor:'#808080',
    borderBottomWidth:0,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    paddingTop: 33,
    height: StatusBarHeight + 30,
    backgroundColor: lighterBlue,
    shadowColor:darkBlue,
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:3,
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
    height:48,
  },
  datePickerView: {
    flex:55,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: lighterBlue,
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
    backgroundColor: lighterBlue,
    color: '#494949',
    borderColor: darkBlue,
    paddingRight: 12,
    width:200,
    borderRadius: 10,
    fontSize: 20,
    fontWeight:'600',
    height: 36,
  },
  noteInputContainer: {
    color:'#494949',
    backgroundColor: '#fff',
    paddingRight: 12,
    width:200,
    borderRadius: 10,
    fontSize: 17,
    fontWeight:'500',
    height: 36,
    paddingHorizontal: 5
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
    backgroundColor:lighterBlue
  },
  itemView: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    height: 50,
    width:(ScreenWidth-15)/3,
    marginTop: 20 
  },
  itemButton: {
    flexDirection: 'column',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10,
    backgroundColor:'#fff',
    width:ScreenWidth/3-15,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    marginTop: -20,
    paddingLeft: 5,
    paddingRight: 5
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '500',
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '300',
    
  },
  modalView: {
    flex:1, 
    justifyContent:'flex-end', 
    backgroundColor:'#000000aa',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    elevation:5,
  }
})

export default Input;