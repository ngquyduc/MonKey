import React, { useState, useEffect } from 'react';
// import { PieChart } from "react-native-chart-kit";
import { ScreenWidth } from '../components/constants';
import { collection, onSnapshot, query, where, getDoc, getDocs, addDoc } from 'firebase/firestore';
import { getUserID } from '../api/authentication';
import { db } from '../api/db';
import { StatusBarHeight } from '../components/constants';
import { colors } from '../components/colors';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, Platform, TextInput, ScrollView, Pressable, Keyboard, StyleSheet, FlatList, Alert} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Entypo, Foundation } from '@expo/vector-icons'
import moment from 'moment';
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import { Octicons, FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { formatter } from '../api/formatCurrency';
import { current } from '@reduxjs/toolkit';
import { useFocusEffect } from '@react-navigation/native';

const {lightYellow, lighterBlue, beige, brown, darkBlue, lightBlue, darkYellow} = colors;

const Stats = (props) => {
  const [income, setIncome] = useState({})
  const [expense, setExpense] = useState({})
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [balance, setBalance] = useState(0)
  const [data1, setData1] = useState([])
  const [data2, setData2] = useState([])
  const [currentItem, setCurrentItem] = useState({})

  const [isIncome, setIsIncome] = useState(false);
  const [isExpense, setIsExpense] = useState(true);
  const [userId, setUserId] = useState(getUserID())
  const openExpense = () => {
    setIsExpense(true);
    setIsIncome(false);
  }
  const openIncome = () => {
    setIsExpense(false);
    setIsIncome(true); 

  }

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
  let [date, setDate] = useState(moment().format('YYYY-MM-DD'));
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
  
  const [expenseCategoryList, setExpenseCategoryList] = useState({})
  const [incomeCategoryList, setIncomeCategoryList] = useState({})

  const getExpenseCategories = async () => {
    try {
      const expenseCategoryRef = query(collection(db, 'Input Category/Expense/' + userId))
      const expenseCats = await getDocs(expenseCategoryRef)
      const expenseCategories = {}
      expenseCats.docs.forEach((doc) => {
        if (doc.data().name != 'Edit') {
          expenseCategories[doc.data().name + 'icon'] = doc.data().icon
          expenseCategories[doc.data().name + 'color'] = doc.data().color
        }
        setExpenseCategoryList(expenseCategories)
      })
    } catch {
      (error) => console.log(error.message)
    }
  }

  const getIncomeCategories = async () => {
    try {
      const incomeCategoryRef = query(collection(db, 'Input Category/Income/' + userId))
      const incomeCats = await getDocs(incomeCategoryRef)
      const incomeCategories = {}
      incomeCats.docs.forEach((doc) => {
        if (doc.data().name != 'Edit') {
          console.log()
          incomeCategories[doc.data().name + 'icon'] = doc.data().icon
          incomeCategories[doc.data().name + 'color'] = doc.data().color
        }
        setIncomeCategoryList(incomeCategories)
      })
    } catch {
      (error) => console.log(error.message)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getExpenseCategories()
      getIncomeCategories()
      return () => {}
    }, [])
  );

  const getFinances = async () => {
    const expenseRef = collection(db, 'Finance/' + getUserID() + '/Expense')
    const incomeRef = collection(db, 'Finance/' + getUserID() + '/Income')
    const monthExpQ = query(expenseRef, where('year', '==', month.substring(0, 4)), where('month', '==', month.substring(5, 7)))
    const monthIncQ = query(incomeRef, where('year', '==', month.substring(0, 4)), where('month', '==', month.substring(5, 7)))
    const yearExpQ = query(expenseRef, where('year', '==', year.substring(0, 4)))
    const yearIncQ = query(incomeRef, where('year', '==', year.substring(0, 4)))

    const q = isMonth ? monthExpQ : yearExpQ
    const otherQ = isMonth ? monthIncQ : yearIncQ

    const finances = await getDocs(q)
    const expenses = new Map()
    finances.docs.forEach((doc) => {
      if (expenses.has(doc.data().category)) {
        var temp = expenses.get(doc.data().category)
        temp += doc.data().amount
        expenses.set(doc.data().category, temp)
      }
      else {
        expenses.set(doc.data().category, doc.data().amount)
      }
    })
    setExpense(expenses)
    var totalExpense = 0
    expenses.forEach((amount, cat) => {totalExpense += amount})
    const temp2 = []
    expenses.forEach((amount, cat) => {
      temp2.push({
      key: cat,
      percentage: (amount / totalExpense * 100).toFixed(2) + '%',
      text: amount / totalExpense < 0.1 ? '' : cat.substring(0, 10), 
      value: amount,
      color: expenseCategoryList[cat+'color'],
      icon: expenseCategoryList[cat+'icon']
      })
    })
    temp2.sort((a, b) => a.key == 'Deleted Category' ? 1 : b.key == 'Deleted Category'? -1 : a.value < b.value ? 1 : -1)
    setData2(temp2)
    setTotalExpense(totalExpense)

    const otherFinances = await getDocs(otherQ)
    const incomes = new Map()
    otherFinances.docs.forEach((doc) => {
      if (incomes.has(doc.data().category)) {
        var temp = incomes.get(doc.data().category)
        temp += doc.data().amount
        incomes.set(doc.data().category, temp)
      }
      else {
        incomes.set(doc.data().category, doc.data().amount)
      }
    })
    setIncome(incomes)      
    var totalIncome = 0
    incomes.forEach((amount, cat) => {totalIncome += amount})    
    const temp1 = []
    incomes.forEach((amount, cat) => temp1.push({
      key: cat,
      percentage: (amount / totalIncome * 100).toFixed(2) + '%',
      text: amount / totalIncome < 0.1 ? '' : cat.substring(0, 10),
      value: amount,
      color: incomeCategoryList[cat+'color'],
      icon: incomeCategoryList[cat+'icon']
    }))
    temp1.sort((a, b) => a.key == 'Deleted Category' ? 1 : b.key == 'Deleted Category'? -1 : a.value < b.value ? 1 : -1)
    setData1(temp1)
    setTotalIncome(totalIncome)
    setBalance(totalIncome - totalExpense)
  }

  useFocusEffect(
    React.useCallback(() => {
      getFinances()
      return () => {}
    }, [isMonth, expenseCategoryList, incomeCategoryList])
  );
  const VisibleItem = ({item}) => {

    return (
      <View style={[styles.rowFront]}>
        <View style={{flex:3, paddingLeft:15, flexDirection:'column'}}>
          <View style={{flexDirection:'row', marginBottom:3}}>
            <Text style={styles.categoryText}>{item.key}</Text>
          </View>
          <View>
            <Text style={styles.noteText}>{item.name}</Text>
          </View>
        </View>
        <View style={{flex:1.5, alignItems:'flex-end', justifyContent:'center', paddingRight:15}}>
          <Text style={styles.amountText}>{'$' + item.amount}</Text>
        </View>
      </View>
    )
  }

  const renderItem = (data, rowMap) => {
    return <VisibleItem data={data}/>
  }



  return (
    <View style={styles.mainContainerInnerScreen}>
      <View style={styles.header}>
        <Text style={styles.boldBlueHeaderText}>Statistics</Text>
      </View>
      <ScrollView style={{backgroundColor:'#fff'}}>
        <Pressable onPress={Keyboard.dismiss}>
          <>
            <View style={styles.mainContainerInnerScreen}>
              <View style={styles.monthAnnualButtonView}>
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
                  <View style={styles.dateView}>
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
                    <View style={styles.datePickerView}>
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
                  <View style={styles.dateView}>
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
                    <View style={styles.datePickerView}>            
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
          {/* <Text style={{color:'green'}}>{"Income: " + totalIncome}</Text>
          <Text style={{color:'red'}}>{"Expense: " + totalExpense}</Text>   
          <Text style={{color:'black'}}>{"Balance: " + balance}</Text> */}
        <View>
          <View style={{flexDirection:'row', marginHorizontal:10, marginBottom:10}}>
            <View style={[styles.incomeexpenseView, {backgroundColor:'#e2f5e2'}]}>
              <Text style={{color:'#26b522', fontSize:14, fontWeight:'500'}}>{" Income: " + formatter.format(totalIncome)}</Text>
            </View>
            <View style={[styles.incomeexpenseView, {backgroundColor:'#fdddcf'}]}>
              <Text style={{color:'#ef5011', fontSize:14, fontWeight:'500'}}>{" Expense: " + formatter.format(totalExpense)}</Text>
            </View>
            <View style={[styles.incomeexpenseView, {backgroundColor:'#e6e6e6'}]}>
              <Text style={{color: '#494949', fontSize:14, fontWeight:'500'}}>{" Balance: " + formatter.format(balance)}</Text>
            </View>
          </View>
        </View>
        </Pressable>
        <View style={styles.expenseInputButtonView}>
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
          <View style={{alignItems: 'center'}}>    
            <PieChart
              data={data1}
              radius={100}
              onPress={(item, index) => {
                if (currentItem.key == undefined || item.key != currentItem.key) {
                  setCurrentItem(item)
                } else {
                  setCurrentItem({})
                }
              }}
              focusOnPress={true}
              extraRadiusForFocused={5}
              shadow={true}
              showText={true}
              textColor={'white'}
              textSize={14}
              textColor={'black'}
              fontWeight={'bold'}
              centerLabelComponent={() => 
                <View>
                  <Text style={[styles.pieChartDetail]}>{currentItem.key != undefined ? currentItem.key: ''}
                  </Text>
                  <Text style={[styles.pieChartDetail]}>{currentItem.key != undefined ? formatter.format(currentItem.value) : ''}
                  </Text>
                  <Text style={[styles.pieChartDetail]}>{currentItem.key != undefined ? currentItem.percentage: ''}
                  </Text>
                </View>
              }
              labelsPosition='outward'
              donut
            />
            {
              data1.map((item) => {
                return (
                  <View style={[styles.rowFront, {backgroundColor: '#fff'}]}>
                    <View style={{flex:3, paddingLeft:15, flexDirection:'column'}}>
                      <View style={{flexDirection:'row', marginBottom:3}}>
                        <View style={{marginRight:10}}>
                          <MaterialCommunityIcons name={item.icon} color={item.color} size={20}/>
                        </View>
                        <Text style={[styles.categoryText]}>{item.key}</Text>
                      </View>
                    </View>
                    <View style={{flex:3, alignItems:'flex-end', justifyContent:'center', paddingRight:15}}>
                      <Text style={[styles.amountText, {color: '#26b522'}]}>{'$' +item.value.toFixed(2)}</Text>
                    </View>
                  </View>
                )
              })
            }
            </View>
          )
        }
        {isExpense && (<View style={{alignItems: 'center'}}>
                
                <PieChart 
                  data={data2}
                  radius={100}
                  onPress={(item, index) => {
                    if (currentItem.key == undefined || item.key != currentItem.key) {
                      setCurrentItem(item)
                    } else {
                      setCurrentItem({})
                    }
                  }}
                  focusOnPress={true}
                  extraRadiusForFocused={5}
                  shadow={true}
                  showText={true}
                  textColor={'white'}
                  textSize={14}
                  textColor={'black'}
                  fontWeight={'bold'}
                  centerLabelComponent={() => 
                    <View>
                      <Text style={[styles.pieChartDetail, {color: currentItem.color}]}>{currentItem.key != undefined ? currentItem.key: ''}
                      </Text>
                      <Text style={[styles.pieChartDetail, {color: currentItem.color}]}>{currentItem.key != undefined ? formatter.format(currentItem.value) : ''}
                      </Text>
                      <Text style={[styles.pieChartDetail, {color: currentItem.color}]}>{currentItem.key != undefined ? currentItem.percentage: ''}
                      </Text>
                    </View>
                  }
                  labelsPosition='outward'
                  donut
                />
                {
                  data2.map((item) => {
                    return (
                      <View style={[styles.rowFront, {backgroundColor: '#fff'}]}>
                        <View style={{flex:3, paddingLeft:15, flexDirection:'column'}}>
                          <View style={{flexDirection:'row', marginBottom:3}}>
                            <View style={{marginRight:10}}>
                              <MaterialCommunityIcons name={item.icon} color={item.color} size={20}/>
                            </View>
                            <Text style={[styles.categoryText, {color: item.color}]}>{item.key}</Text>
                          </View>
                        </View>
                        <View style={{flex:3, alignItems:'flex-end', justifyContent:'center', paddingRight:15}}>
                          <Text style={[styles.amountText, {color: '#ef5011'}]}>{'$' +item.value.toFixed(2)}</Text>
                        </View>
                      </View>
                    )
                  })
                }
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

const styles = StyleSheet.create({
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
    backgroundColor:'#fff'
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
  boldBlueHeaderText: {
    fontSize: 34,
    color: darkBlue,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  inputButton: {
    padding: 5,
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputText: {
    fontSize: 15,
    fontWeight: '500',
    color: beige,
  },
  dateText: {
    fontSize: 19,
    fontWeight: '600',
    color: darkBlue,
  },
  datePickerOffText: {
    fontSize: 18,
    fontWeight: '400',
    color: lightBlue,
  },
  monthAnnualButtonView: {
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
    height:55,
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
  expenseInputButtonView: {
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
    height:55,
    paddingLeft:40,
    paddingRight:40
  },
  categoryText: {
    fontSize:20,
    fontWeight:'bold'
  },
  noteText: {
    fontSize:15,
    fontWeight:'400'
  },
  amountText: {
    fontSize:20,
    fontWeight:'bold'
  },
  rowFront: {
    flexDirection:'row',
    backgroundColor: '#fff',
    alignItems:'center',
    borderRadius:10,
    height:55,
    marginHorizontal: 12, 
    marginBottom:10,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    elevation:5,
  },
  incomeexpenseView: {
    flexDirection:'row',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
    marginHorizontal:4,
    marginBottom:5,
    height:40,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
  },
  pieChartDetail: {
    justifyContent:'center',
    alignSelf:'center',
  }
})