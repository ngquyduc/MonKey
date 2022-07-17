import React, {useState, useMemo, useEffect} from 'react';
import { View, Text, TouchableOpacity, Alert, Animated, Modal, TextInput, ScrollView, Pressable, Keyboard, StyleSheet, FlatList} from 'react-native';
import { colors } from '../components/colors';
import moment from 'moment';
import { ScreenHeight } from '../components/constants';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../api/db';
import { getUserID } from '../api/authentication';
import ActivityRings from "react-native-activity-rings";  
import { StatusBarHeight } from '../components/constants';
import { Octicons, FontAwesome, Feather, MaterialCommunityIcons, Entypo, Foundation } from '@expo/vector-icons'
import { SwipeListView } from 'react-native-swipe-list-view';
import { Timestamp } from 'firebase/firestore';
import { formatter } from '../api/formatCurrency';
import { useFocusEffect } from '@react-navigation/native';
const { lightYellow, beige, lightBlue, darkBlue, darkYellow, lighterBlue } = colors

const Home = ({navigation}) => {
  // User name
  const [userName, setUserName] = useState('')
  /*********** Limit Ring ***********/
  const [monthLimit, setMonthLimit] = useState(0); 
  const [dayLimit, setDayLimit] = useState(0); 
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [monthExpense, setMonthExpense] = useState(0)
  const [dayExpense, setDayExpense] = useState(0)
  /*********** display today's expense & income ***********/
  const [finances, setFinances] = useState([])
  const [dayIncomes, setDayIncomes] = useState([])
  const [dayExpenses, setDayExpenses] = useState([])
  const [dayIncome, setDayIncome] = useState(0)
  const [expenseCategoryList, setExpenseCategoryList] = useState({})
  const [incomeCategoryList, setIncomeCategoryList] = useState({})
  const [userId, setUserId] = useState(getUserID())


  const getUsername = async () => {
    try {
      const userRef = doc(db, "Users", userId);
      const user = await getDoc(userRef)
      setUserName(user.data().username)
    } catch {
      (error) => console.log(error.message)
    }
  }

  const getSpendingLimit = async () => {
    try {
      const financeRef = doc(db, "Spending Limit", userId)
      const spendingLimit = await getDoc(financeRef)
      setMonthLimit(spendingLimit.data().monthLimit)
      setDayLimit(spendingLimit.data().dayLimit)
    } catch {
      (error) => console.log(error.message)
    }
  }
  
  const getExpenseCategories = async () => {
    try {
      const expenseCategoryRef = query(collection(db, 'Input Category/Expense/' + userId))
      const expenseCats = await getDocs(expenseCategoryRef)
      const expenseCategories = {}
      expenseCats.docs.forEach((doc) => {
        if (doc.data().name != 'Deleted Category' && doc.data().name != 'Edit') {
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
        if (doc.data().name != 'Deleted Category' && doc.data().name != 'Edit') {
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
      getUsername()
      getSpendingLimit()
      getExpenseCategories()
      getIncomeCategories()
      return () => {}
    }, [])
  );
    
  // get month expense and today expense & income
  useFocusEffect(
    React.useCallback(() => {
      const expensePath = 'Finance/' + getUserID() + '/Expense'
      const expenseRef = collection(db, expensePath)
      const dayExpenseQuery = query(expenseRef, where('year', '==', date.substring(0,4)), where('month', '==', date.substring(5, 7)))
      const unsubDayExpense = onSnapshot(dayExpenseQuery, (snapShot) => {
        const dayExpenses = []
        let dayExpense = 0
        let monthExpense = 0
        snapShot.forEach((doc) => {
          monthExpense += doc.data().amount
          if (doc.data().date == date.substring(8, 10)) {
            dayExpense += doc.data().amount
            dayExpenses.push({
              key: doc.id,
              id: doc.id,
              type: 'expense',
              amount: doc.data().amount,
              note: doc.data().note,
              category: doc.data().category,
              icon: expenseCategoryList[doc.data().category+'icon'],
              color: expenseCategoryList[doc.data().category+'color'],
              notedAt: doc.data().notedAt
            })
          }
        })
        setDayExpenses(dayExpenses)
        setDayExpense(dayExpense)
        setMonthExpense(monthExpense)      
    })
    const incomePath = 'Finance/' + getUserID() + '/Income'
    const incomeRef = collection(db, incomePath)
    const dayIncomeQuery = query(incomeRef, where('year', '==', date.substring(0,4)), where('month', '==', date.substring(5, 7)), where('date', '==', date.substring(8, 10)))
    const unsubDayIncome = onSnapshot(dayIncomeQuery, (snapShot) => {
      const dayIncomes = []
      let dayIncome = 0
      snapShot.forEach((doc) => {
        dayIncomes.push({
          key: doc.id,
          id: doc.id,
          type: 'income', 
          amount: doc.data().amount,
          note: doc.data().note,
          category: doc.data().category,
          icon: incomeCategoryList[doc.data().category+'icon'],
          color: incomeCategoryList[doc.data().category+'color'],
          notedAt: doc.data().notedAt
        })
        dayIncome += doc.data().amount
      })
      setDayIncomes(dayIncomes)
      setDayIncome(dayIncome)
    })
      return () => {
        unsubDayExpense()
        unsubDayIncome()
      }
    }, [incomeCategoryList, expenseCategoryList])
  );

  useEffect(() => {
    const finances = dayExpenses.concat(...dayIncomes)
    finances.sort((a, b) => a.notedAt > b.notedAt ? -1 : 1)
    setFinances(finances)
  }, [dayExpenses, dayIncomes])

  /*********** Activity ring config ***********/
  const activityData = [ 
    //the rings are disappear when the values equal 0 or more than 1
    { value: monthExpense/monthLimit > 1 ? 1 :(monthExpense == 0? 0.0000001 : monthExpense/monthLimit), color:darkBlue }, 
    { value: dayExpense/dayLimit > 1 ? 1 : (dayExpense == 0 ? 0.0000001 : dayExpense/dayLimit), color:darkYellow }, 
  ];

  const activityConfig = { 
    width: 150,  
    height: 150,
    ringSize:20
  };
  
  const alertChangeLimit = () => {
    Alert.alert("Adjust your expense limit?","", [
      {text: 'Cancel', onPress: () => console.log('Alert closed')},
      {text: 'Yes', onPress: () => {navigation.navigate('EditLimitScreen')}}
    ]);
  }
  /*********** SwipeListView stuffs ***********/
  const HiddenItemWithActions = props => {
    const {swipeAnimatedValue, onEdit, onDelete} = props;
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity style={[styles.backRightButton, styles.backRightButtonLeft]} onPress={onEdit}>
          <Feather name="edit-3" size={25} color="#fff"/>  
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backRightButton, styles.backRightButtonRight]} onPress={onDelete}>
          <Animated.View style={[styles.trash, {
            transform: [
              {
                scale:swipeAnimatedValue.interpolate({
                  inputRange: [-90,-45],
                  outputRange:[1,0],
                  extrapolate:'clamp',
                }),
              },
            ],
          }]}>
            <Octicons name="trash" size={24} color="#fff"/>
          </Animated.View>
        </TouchableOpacity>
      </View>
    )
  }

  const renderHiddenItem = (data, rowMap) => {
    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        onEdit={()=>{
            navigation.navigate('EditItemScreen', {
            inprogressAmount:data.item.amount.toString(),
            inprogressCategory:data.item.category,
            inprogressDate:moment().format('YYYY-MM-DD'),
            inprogressNote:data.item.note,
            inprogressType:data.item.type,
            inprogressId:data.item.id,
            color:data.item.color,
          })
        }}
        onDelete={()=>alertDelete(rowMap, data.item.key, data.item.id, data.item.type)}
      />
    )
  }

  const VisibleItem = props => {
    const {data} = props;
    return (
      <View style={[styles.rowFront, {backgroundColor: '#fff'}]}>
        <View style={{flex:3, paddingLeft:15, flexDirection:'column'}}>
          <View style={{flexDirection:'row', marginBottom:3}}>
            <View style={{marginRight:10}}>
              <MaterialCommunityIcons name={data.item.icon} color={data.item.color} size={20}/>
            </View>
            <Text style={styles.categoryText}>{data.item.category}</Text>
          </View>
          {data.item.note != '' && 
          <View>
            <Text style={styles.noteText}>{data.item.note}</Text>
          </View>}
        </View>
        <View style={{flex:2,alignItems:'flex-end', justifyContent:'center', paddingRight:15}}>
          <Text style={[styles.amountText,{color:data.item.type == 'income' ? '#26b522' : '#ef5011'}]}>{formatter.format(data.item.amount)}</Text>
        </View>
      </View>
    )
  }

  const renderItem = (data, rowMap) => {
    return <VisibleItem data={data}/>
  }

  /*************** Function to alert when deleting ***************/
  const alertDelete = (rowMap, rowKey, id, type) => {
    Alert.alert("Delete this record?","", [
      {text: 'Cancel', onPress: () => {closeRow(rowMap, rowKey)}},
      {text: 'Delete', onPress: () => {deleteRow(id, type)}}
    ]);
  }
  /*************** Function to delete record ***************/
  const deleteRow = (id, type) => {
    if (type == 'expense') {
      const expense = doc(db, 'Finance/' + getUserID() + '/Expense', id)
      deleteDoc(expense)
    } else {
      const income = doc(db, 'Finance/' + getUserID() + '/Income', id)
      deleteDoc(income)
    }
  }
  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  }

  return (
    <View style={{flex:1}}>
      <View style={styles.container}>
        {/************ Header ************/}
        <View style={styles.header}>
          <View>
            <Text style={styles.boldBlueHeaderText}>Welcome,</Text>
            <View style={{alignItems:'flex-end'}}>
              <Text style={styles.boldBlueHeaderText}>{userName + " !"}</Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}> 
          {/************ Limit ring ************/}
          <TouchableOpacity style={{flexDirection:'column'}} onPress={() => {alertChangeLimit()}}>
            <View style={styles.ringView}>
              <View style={{height:35, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontSize:20, fontWeight:'600', color:darkYellow}}>Spending limit</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <View style={{marginRight:4,flex: 1.3}}>
                  <ActivityRings theme='dark' data={activityData} config={activityConfig}/>
                </View> 
                <View style={{flexDirection:'column', flex: 2, alignContent:'center',justifyContent:'center'}}>
                  <View style={{flexDirection:'row', margin:5}}>
                    <Octicons name='dot-fill' size={40} color={darkBlue}/>
                    <View style={{alignContent:'center',justifyContent:'center'}}>
                      <Text style={{fontWeight:'500', fontSize:15}}>{' Month limit: ' + formatter.format(monthExpense) + '/' + monthLimit}</Text>
                      {monthExpense>monthLimit && <Text style={{color:'#ef5011', fontWeight:'bold'}}>{' Exceeded!!!'}</Text>}
                    </View>
                  </View>
                  <View style={{flexDirection:'row', margin:5}}>
                    <Octicons name='dot-fill' size={40} color={darkYellow}/>
                    <View style={{alignContent:'center',justifyContent:'center'}}>
                      <Text style={{fontWeight:'500', fontSize:15}}>{' Day limit: ' + formatter.format(dayExpense) + '/' + dayLimit}</Text>
                      {dayExpense>dayLimit && <Text style={{color:'#ef5011', fontWeight:'bold'}}>{' Exceeded!!!'}</Text>}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>

            {/************ Today's records ************/}
          <View> 
            <View style={{paddingBottom:7}}>
              <View style={{alignItems:'center', justifyContent:'center', paddingBottom:7}}>
                <Text style={{fontSize:16, fontWeight:'700', color:darkBlue}}>{"Today: " + moment().format('DD-MM-YYYY')}</Text>
              </View>
              <View style={{flexDirection:'row', marginBottom:10}}>
                <View style={[styles.incomeexpenseView, {backgroundColor:'#e2f5e2'}]}>
                  <FontAwesome name='plus-circle' color={'#26b522'} size={18}/>
                  <Text style={{color:'#26b522', fontSize:16, fontWeight:'500'}}>{" Income: " + formatter.format(dayIncome)}</Text>
                </View>
                <View style={[styles.incomeexpenseView, {backgroundColor:'#fdddcf'}]}>
                  <FontAwesome name='minus-circle' color={'#ef5011'} size={18}/>
                  <Text style={{color:'#ef5011', fontSize:16, fontWeight:'500'}}>{" Expense: " + formatter.format(dayExpense)}</Text>
                </View>
              </View>
            </View>
            {/************ List ************/}
            <View style={{height:(325-(896-ScreenHeight))}}>
              {finances.length != 0 && <SwipeListView 
                data={finances}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-150}
                disableRightSwipe
                showsVerticalScrollIndicator={true}
              />}
              {finances.length == 0 && 
                <View style={{alignItems:'center', justifyContent:'center', paddingTop:20}}>
                  <Feather name='x-circle' size={110} color='#e0e0e0'/>
                  <Text style={{fontSize:40, color:'#e0e0e0', fontWeight:'bold'}}>No record!</Text>
                </View>
              }
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: lighterBlue,
  },
  header: {
    flex:1,
    justifyContent:'flex-end',
    paddingHorizontal:30,
    paddingBottom:14,
  },
  footer: {
    flex:3.8,
    backgroundColor:'#fff',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    paddingHorizontal:15,
    paddingVertical:18,
  },
  boldBlueHeaderText: {
    fontSize: 35,
    color: darkBlue,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  ringView: {
    flexDirection:'column',
    backgroundColor: '#fff',
    borderRadius:25,
    height:193,
    marginBottom:10,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    elevation:5,
    paddingLeft:10
  },
  incomeexpenseView: {
    flexDirection:'row',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
    marginHorizontal:7,
    marginBottom:5,
    height:40,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
  },
  rowFront: {
    flexDirection:'row',
    backgroundColor: '#fff',
    alignItems:'center',
    borderRadius:10,
    height:55,
    marginHorizontal: 5, 
    marginBottom:10,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    elevation:5,
  },
  rowFrontVisible: {
    backgroundColor:'#fff',
    borderRadius:5,
    height:55,
    padding:10,
    marginBottom:15,
  },
  rowBack: {
    alignItems:'center',
    backgroundColor:'#DDD',
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingLeft:15,
    margin:5,
    marginBottom:15,
    borderRadius:5,
  },
  backRightButton: {
    bottom:0,
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    top:0,
    width:75, 
  },
  backRightButtonLeft: {
    backgroundColor:'#1f65ff',
    right:75,
    height:55, 
    marginTop:-5
  },
  backRightButtonRight: {
    backgroundColor:'red',
    right:0,
    borderTopRightRadius:11,
    borderBottomRightRadius:11,
    height:55, 
    marginTop:-5
  },
  categoryText: {
    fontSize:18,
    fontWeight:'600'
  },
  noteText: {
    fontSize:15,
    fontWeight:'400'
  },
  amountText: {
    fontSize:20,
    fontWeight:'bold'
  },
  headerModal: {
    alignItems:'flex-end', 
    justifyContent:'center',
    backgroundColor:'#fff',
    borderBottomColor:'#808080',
    borderBottomWidth:1,
    height: StatusBarHeight + 48,
  },
  cancelText: {
    fontSize:18,
    color:'#fff',
    fontWeight:'500',
  },
  submitButtonView: {
    alignItems:'center',
    justifyContent:'center',
    paddingBottom:4,
    paddingTop:4,
    paddingLeft:4,
    borderBottomColor: '#E9E9E9',
    borderTopColor: '#E9E9E9',     
    height:48
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
  propertiesView: {
    flexDirection:'row',
    paddingBottom:7,
    paddingTop:7,
    paddingLeft:4,
    borderBottomColor: '#E9E9E9',
    borderTopColor: '#E9E9E9',
    borderTopWidth:1,            
    height:48
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
  datePickerView: {
    flex:55,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#FDEE87',
    borderRadius:20
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
  itemView: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    height: 50,
    width:138, 
  },
  itemButton: {
    flexDirection: 'column',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:10,
    backgroundColor:'#fff',
    width:128,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  }
})

export default Home;