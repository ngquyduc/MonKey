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

const {lightYellow, lighterBlue, beige, brown, darkBlue, lightBlue, darkYellow} = colors;

const Stats = (props) => {
  const [income, setIncome] = useState({})
  const [expense, setExpense] = useState({})
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)
  const [balance, setBalance] = useState(0)
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

  useEffect(() => {
    const expenseCategoryRef = collection(db, 'Input Category/Expense/' + getUserID())

    onSnapshot(expenseCategoryRef, (snapshot) => {
      let expenseCategories = {}
      snapshot.docs.forEach((doc) => {
        expenseCategories[doc.data().name + 'color'] = doc.data().color
        expenseCategories[doc.data().name + 'icon'] = doc.data().icon
      })
      setExpenseCategoryList(expenseCategories)
    })

    const incomeCategoryRef = collection(db, 'Input Category/Income/' + getUserID())

    onSnapshot(incomeCategoryRef, (snapshot) => {
      let incomeCategories = {}
      snapshot.docs.forEach((doc) => {
        incomeCategories[doc.data().name + 'color'] = doc.data().color
        incomeCategories[doc.data().name + 'icon'] = doc.data().icon
      })
      setIncomeCategoryList(incomeCategories)
    })
  }, [])

  useEffect(() => {
    const financeRef = collection(db, 'Finance/' + getUserID() + '/' + year)
    const monthQ = query(financeRef, where('month', '==', month.substring(5, 7)))
    // const monthIncQ = query(financeRef, where('month', '==', month.substring(5, 7)), where('type', '==', 'income'))
    const yearQ = query(financeRef)
    // const yearIncQ = query(financeRef, where('type', '==', 'income'))
    const q = isMonth ? monthQ : yearQ
    
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
          key: cat,
          percentage: (amount / totalExpense * 100).toFixed(2) + '%',
          text: amount / totalIncome < 0.1 ? '' : cat,
          value: amount,
          color: incomeCategoryList[cat+'color'],
          icon: incomeCategoryList[cat+'icon']
        }))
        temp1.sort((a, b) => a.value > b.value ? -1 : 1)
        setData1(temp1)
        setTotalIncome(totalIncome)
        const temp2 = []
        expenses.forEach((amount, cat) => {
          temp2.push({
          key: cat,
          percentage: (amount / totalExpense * 100).toFixed(2) + '%',
          text: amount / totalExpense < 0.1 ? '' : cat, 
          value: amount,
          color: expenseCategoryList[cat+'color'],
          icon: expenseCategoryList[cat+'icon']
          })
        })
        temp2.sort((a, b) => a.value > b.value ? -1 : 1)
        setData2(temp2)
        setTotalExpense(totalExpense)
        setBalance(totalIncome - totalExpense)
      }
    )
    
  }, [isMonth, isAnnual, isExpense, isIncome, incomeCategoryList, expenseCategoryList])

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
              onPress={(item, index) => console.log(item)}
              focusOnPress={true}
              extraRadiusForFocused={5}
              shadow={true}
              showText={true}
              textColor={'white'}
              textSize={15}
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
                        <Text style={[styles.categoryText, {color: item.color}]}>{item.key}</Text>
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
                  onPress={(item, index) => console.log(item)}
                  focusOnPress={true}
                  extraRadiusForFocused={3}
                  shadow={true}
                  showText={true}
                  textColor={'white'}
                  textSize={15}
                  labelsPosition='outward'
                  donut
                />
                {/* <FlatList
                  data={data2}
                  renderItem={({item}) => (
                    <Text>{item.key}</Text>
                  )}
                /> */}
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
})