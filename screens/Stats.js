import React, { useState, useEffect } from 'react';
import { PieChart } from "react-native-chart-kit";
import { ScreenWidth } from '../components/constants';
import { onSnapshot, query, where } from 'firebase/firestore';
import { getUserID } from '../api/authentication';
import { financeRef } from '../api/db';
import { StatusBarHeight } from '../components/constants';
import { colors } from '../components/colors';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, Platform, TextInput, ScrollView, Pressable, Keyboard, StyleSheet, FlatList, Alert} from 'react-native';
import styles from '../components/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Entypo, Foundation } from '@expo/vector-icons'
import moment from 'moment';
// import MonthPicker from 'react-native-month-year-picker';

const {lightYellow, beige, brown, darkBlue, lightBlue, darkYellow} = colors;

const Stats = (props) => {
  const [income, setIncome] = useState({})
  const [expense, setExpense] = useState({})
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [data1, setData1] = useState([])
  const [data2, setData2] = useState([])

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

  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0');
    return `#${randomColor}`;
  };

  /********** Bool to switch screens **********/
  const [isMonth, setIsMonth] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);
  const openMonth = () => {
    setIsMonth(true);
    setIsAnnual(false);
    setDate(moment())
    setMonth(moment().format('YYYY-MM'))
  }
  const openAnnual = () => {
    setIsMonth(false);
    setIsAnnual(true); 
    setDate(moment())
    setYear(moment().format('YYYY'))
  }

  /********** Date Picker Variables **********/
  let [date, setDate] = useState(moment());
  let [month, setMonth] = useState(moment().format('YYYY-MM'));
  let [year, setYear] = useState(moment().format('YYYY'))
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    setDate(moment(selectedDate))
    setMonth(moment(selectedDate).format('YYYY-MM'))
  }

  const addOneMonth = () => {
    setDate(moment(date).add(1, 'month'))
    setMonth(moment(date).add(1, 'month').format('YYYY-MM'))
  }

  const addOneYear = () => {
    setDate(moment(date).add(1, 'year'));
    setYear(moment(date).add(1, 'year').format('YYYY'))
  }

  const subtractOneMonth = () => {
    setDate(moment(date).subtract(1, 'month'))
    setMonth(moment(date).subtract(1, 'month').format('YYYY-MM'))
  }

  const subtractOneYear = () => {
    setDate(moment(date).subtract(1, 'year'))
    setYear(moment(date).subtract(1, 'year').format('YYYY'))
  }
  

  useEffect(() => {
    const monthExpQ = query(financeRef, where("user", "==", getUserID()), where('month', '==', month), where('type', '==', 'expense'))
    const monthIncQ = query(financeRef, where("user", "==", getUserID()), where('month', '==', month), where('type', '==', 'income'))
    const yearExpQ = query(financeRef, where("user", "==", getUserID()), where('year', '==', year), where('type', '==', 'expense'))
    const yearIncQ = query(financeRef, where("user", "==", getUserID()), where('year', '==', year), where('type', '==', 'income'))
    const q = isMonth && isExpense ? monthExpQ :
              isMonth && isIncome ? monthIncQ :
              isAnnual && isExpense ? yearExpQ :
              yearIncQ;
    onSnapshot(q,
      (snapShot) => {
        const expenses = new Map()
        const incomes = new Map()
        snapShot.forEach((doc) => {
          if (doc.data().type == 'expense') {
            if (expenses.has(doc.data().category)) {
              var temp = expenses.get(doc.data().category)
              temp += doc.data().amount
              expenses.set(doc.data().category, temp)
            }
            else {
              expenses.set(doc.data().category, doc.data().amount)
            }
          } else {
            if (incomes.has(doc.data().category)) {
              var temp = incomes.get(doc.data().category)
              temp += doc.data().amount
              incomes.set(doc.data().category, temp)
            }
            else {
              incomes.set(doc.data().category, doc.data().amount)
            }
          }
        })
        setIncome(incomes)      
        setExpense(expenses)
        var totalIncome = 0
        incomes.forEach((amount, cat) => {totalIncome += amount})
        var totalExpense = 0
        expenses.forEach((amount, cat) => {totalExpense += amount})
        const temp1 = []
        incomes.forEach((amount, cat) => temp1.push({
          name: cat,
          amount: amount,
          color: generateColor(),
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        }))
        setData1(temp1)
        setTotalIncome(totalIncome)
        const temp2 = []
        expenses.forEach((amount, cat) => temp2.push({
          name: cat,
          amount: amount,
          color: generateColor(),
          legendFontColor: "#7F7F7F",
          legendFontSize: 15
        }))
        setData2(temp2)
        setTotalExpense(totalExpense)
      }
    )
  }, [month, year, isMonth, isExpense])

  

  return (
    <View style={stylesss.mainContainerInnerScreen}>
      <View style={stylesss.header}>
        <Text style={stylesss.boldBlueHeaderText}>Statistics</Text>
      </View>
      <ScrollView>
        <Pressable onPress={Keyboard.dismiss}>
          <>
            <View style={styles.mainContainerInnerScreen}>
              <View style={styless.monthAnnualButtonView}>
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
        {isIncome && (
          <View>
                <Text style={{color:'green'}}>{"Income: " + totalIncome}</Text>     
                <PieChart
                  data={data1}
                  width={ScreenWidth}
                  height={250}
                  chartConfig={chartConfig}
                  accessor={"amount"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                  center={[10, 10]}
                  absolute
                />
                
            </View>
          )
        }
        {isExpense && (<View>
                <Text style={{color:'red'}}>{"Expense: " + totalExpense}</Text>
                <PieChart
                  data={data2}
                  width={ScreenWidth}
                  height={250}
                  chartConfig={chartConfig}
                  accessor={"amount"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                  center={[10, 10]}
                  absolute
                />
                </View>)
        }
      </ScrollView>
        
      
    </View>
  );
}

export default Stats;

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 3, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

const stylesss = StyleSheet.create({
  container:{
    backgroundColor: '#e5e5e5',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
  },
  innerContainer:{
    alignItems:'center',
    flexDirection: 'column',
  },
  mainContainerInnerScreen: {
    flex: 1,
  },
  header: {
    alignItems:'center', 
    justifyContent:'flex-end',
    backgroundColor:'#fff',
    borderBottomColor:'#808080',
    borderBottomWidth:1,
    paddingTop:3,
    height: StatusBarHeight + 48,
  },
  boldBlueHeaderText: {
    fontSize: 34,
    color: darkBlue,
    marginBottom: 10,
    fontWeight: 'bold',
  },
})

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
  monthAnnualButtonView: {
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
    height:60,
    paddingLeft:40,
    paddingRight:40
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
