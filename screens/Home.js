import { StatusBar } from 'expo-status-bar';
import React, {useState, useMemo} from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, TextInput, ScrollView, Pressable, Keyboard, StyleSheet, FlatList} from 'react-native';
import { colors } from '../components/colors';
import moment from 'moment';
import { query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { financeRef,db } from '../api/db';
import { getUserID } from '../api/authentication';
import ActivityRings from "react-native-activity-rings";  
import { StatusBarHeight } from '../components/constants';
import { Octicons, FontAwesome } from '@expo/vector-icons'
import { SwipeListView } from 'react-native-swipe-list-view';
const { lightYellow, beige, lightBlue, darkBlue, darkYellow } = colors

const Home = ({navigation}) => {
  const username = 'Team Grape'
  let [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  let [month, setMonth] = useState(moment().format('YYYY-MM'));
  let [year, setYear] = useState(moment().format('YYYY'))
  /*********** Variables ***********/
  const [monthLimit, setMonthLimit] = useState(700);
  const [dayLimit, setDayLimit] = useState(40);
  /*********** Variables ***********/
  const [finances, setFinances] = useState([])
  const [financesMonth, setFinancesMonth] = useState([])
  const [income, setIncome] = useState(0)
  const [incomeMonth, setIncomeMonth] = useState(0)
  const [incomeDays, setIncomeDays] = useState([])
  const [expense, setExpense] = useState(0)
  const [expenseMonth, setExpenseMonth] = useState(0)
  const [total, setTotal] = useState(0)
  const [expenseDays, setExpenseDays] = useState([])

  /*********** Activity ring config ***********/
  const activityData = [ 
    //the rings are disappear when the values equal 0 or more than 1
    { value: expenseMonth/monthLimit > 1 ? 1 :(expenseMonth == 0? 0.0000001 : expenseMonth/700), color:darkBlue }, 
    { value: expense/dayLimit > 1 ? 1 : (expense == 0 ? 0.0000001 : expense/50), color:darkYellow }, 
  ];

  const activityConfig = { 
    width: 150,  
    height: 150,
    ringSize:20
  };

  useMemo(() => {
    const dayQuery = query(financeRef, where("user", "==", getUserID()), where('date', '==', date), orderBy("time", "desc"))
    onSnapshot(dayQuery,
      (snapShot) => {
        const finances = []
        const expenses = []
        const incomes = []
        snapShot.forEach((doc) => {
          finances.push({
            date: doc.data().date,
            amount: doc.data().amount,
            note: doc.data().note,
            category: doc.data().category,
            type: doc.data().type,
            id: doc.id,
          })
          if (doc.data().type == 'expense') {
            expenses.push(doc.data().amount)
          } else {
            incomes.push(doc.data().amount)
          }
        })
        setFinances(finances)
        const totalIncome = incomes.reduce((total, current) => total = total + current, 0);
        setIncome(totalIncome)
        const totalExpense = expenses.reduce((total, current) => total = total + current, 0);
        setExpense(totalExpense)
      }
    )
    const monthQuery = query(financeRef, where("user", "==", getUserID()), where('month', "==", month))
    onSnapshot(monthQuery,
      (snapShot) => {
        const expensesMonth = []
        const incomesMonth = []
        const expenseDays = []
        const incomeDays = []
        snapShot.forEach((doc) => {
          if (doc.data().type == 'expense') {
            expensesMonth.push(doc.data().amount)
            expenseDays.push(doc.data().date)
          } else {
            incomesMonth.push(doc.data().amount)
            incomeDays.push(doc.data().date)
          }
        })
        const totalIncomeMonth = incomesMonth.reduce((total, current) => total = total + current, 0);
        setIncomeMonth(totalIncomeMonth)
        setIncomeDays(incomeDays)
        setExpenseDays(expenseDays)
        const totalExpenseMonth = expensesMonth.reduce((total, current) => total = total + current, 0);
        setExpenseMonth(totalExpenseMonth)
        setTotal(totalIncomeMonth - totalExpenseMonth)
      }
    )
  }, [])

  const alertChangeLimit = () => {
    Alert.alert("Adjust your expense limit?","", [
      {text: 'Cancel', onPress: () => console.log('Alert closed')},
      {text: 'Yes', onPress: () => {navigation.navigate('EditLimitScreen')}}
    ]);
  }

  /*************** Function to delete record ***************/
  const deleteRow = (id) => {
    const cat = doc(db, 'Input Category/Expense/' + getUserID(), id)
    deleteDoc(cat)
  }
  /*************** Function to edit record ***************/
  const editRow = (id) => {
    const path = 'Input Category/Expense/' + getUserID()
    const catRef = doc(db, path, id)
    updateDoc(catRef, {
      name: inprogressCategory,
      color: inprogressColor,
      icon: inprogressIcon,
    })
  }

  const HiddenItemWithActions = props => {
    const {swipeAnimatedValue, onEdit, onDelete} = props;
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity style={[styles.backRightButton, styles.backRightButtonLeft, {height:55}]} onPress={onEdit}>
          <Feather name="edit-3" size={25} color="#fff"/>  
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backRightButton, styles.backRightButtonRight,{height:55}]} onPress={onDelete}>
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

  const VisibleItem = props => {
    const {data} = props;
    if (data.item.isEdit) {
      return null;
    }
    return (
      <View style={styles.rowFront}>
        <View style={{alignItems:'center', justifyContent:'center', width:50}}>
          <MaterialCommunityIcons name={data.item.icon} size={24} color={data.item.color}/>
        </View>
        <Text style={styles.title}>{data.item.title}</Text>
      </View>
    )
  }

  const renderItem = (data, rowMap) => {
    return <VisibleItem data={data}/>
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.boldBlueHeaderText}>Welcome,</Text>
          <View style={{alignItems:'flex-end'}}>
            <Text style={styles.boldBlueHeaderText}>{username + " !"}</Text>
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
              <View style={{marginRight:4}}>
                <ActivityRings theme='dark' data={activityData} config={activityConfig}/>
              </View> 
              <View style={{flexDirection:'column', alignContent:'center',justifyContent:'center'}}>
                <View style={{flexDirection:'row', margin:5}}>
                  <Octicons name='dot-fill' size={40} color={darkBlue}/>
                  <View style={{alignContent:'center',justifyContent:'center'}}>
                    <Text style={{fontWeight:'500', fontSize:15}}>{' Month limit: ' + expenseMonth + '/' + monthLimit + '$'}</Text>
                  </View>
                </View>
                <View style={{flexDirection:'row', margin:5}}>
                  <Octicons name='dot-fill' size={40} color={darkYellow}/>
                  <View style={{alignContent:'center',justifyContent:'center'}}>
                    <Text style={{fontWeight:'500', fontSize:15}}>{' Day limit: ' + expense + '/' + dayLimit + '$'}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/************ Today's records ************/}
        <View>
          <View style={{alignItems:'center', justifyContent:'center', paddingBottom:7}}>
            <Text style={{fontSize:18, fontWeight:'500'}}>{"Today's record(s)"}</Text>
          </View>
          <View style={{flexDirection:'row', marginHorizontal:10, marginBottom:10}}>
            <View style={[styles.incomeexpenseView, {backgroundColor:'#e2f5e2'}]}>
              <FontAwesome name='plus-circle' color={'#26b522'} size={21}/>
              <Text style={{color:'#26b522', fontSize:17, fontWeight:'500'}}>{" Income: $" + income}</Text>
            </View>
            <View style={[styles.incomeexpenseView, {backgroundColor:'#fdddcf'}]}>
              <FontAwesome name='minus-circle' color={'#ef5011'} size={21}/>
              <Text style={{color:'#ef5011', fontSize:17, fontWeight:'500'}}>{" Expense: $" + expense}</Text>
            </View>
          </View>
        </View>
        {/************ List ************/}
        <View style={{height: 285}}>
          <SwipeListView/>
          {/* <FlatList
            style={{height:'100%'}}
            data={finances}
            numColumns={1}
            renderItem={({item}) => (
              <View style={stylesss.container}>
                <View style={stylesss.innerContainer}>
                  <Text>{item.date}</Text>
                  <Text>{"category: " + item.category}</Text>
                  <Text>{"note: " + item.note}</Text>
                  <Text
                    style={{
                      color: item.type=='expense'
                        ?'red'
                        :'green',
                    }}
                  >
                    {"amount: $" + item.amount.toString()}
                  </Text>
                  <Pressable 
                    style={{alignSelf:'flex-end'}}
                    onPress={() => deleteDoc(doc(db, 'finance', item.id))}
                  >
                    <Text style={{color:'red'}}>Delete note</Text>
                  </Pressable>
                </View>
              </View>
            )}
          /> */}
        </View>
      </View>
    </View>
    // <>
    // <StatusBar style='dark'/>
    //   <View style={styless.header}>
    //     <Text style={styles.boldBlueHeaderText}>Home</Text>
    //   </View>
    //   <View>
    //     <View>
    //       <Text>{"Today: " + date.split('-').reverse().join('-')}</Text>
    //       <Text style={{color:'green'}}>{"Income: $" + income}</Text>
    //       <Text style={{color:'red'}}>{"Expense: $" + expense}</Text>
    //     </View>
    //     <View style={{height: 300}}>
    //       <FlatList
    //         style={{height:'100%'}}
    //         data={finances}
    //         numColumns={1}
    //         renderItem={({item}) => (
    //           <View
    //             style={stylesss.container}
    //           >
    //             <View style={stylesss.innerContainer}>
    //               <Text>
    //                 {item.date}
    //               </Text>
    //               <Text>{"category: " + item.category}</Text>
    //               <Text>{"note: " + item.note}</Text>
    //               <Text
    //                 style={{
    //                   color: item.type=='expense'
    //                     ?'red'
    //                     :'green',
    //                 }}
    //               >
    //                 {"amount: $" + item.amount.toString()}
    //               </Text>
    //               <Pressable 
    //                 style={{alignSelf:'flex-end'}}
    //                 onPress={() => deleteDoc(doc(db, 'finance', item.id))}
    //               >
    //                 <Text style={{color:'red'}}>Delete note</Text>
    //               </Pressable>
    //             </View>
    //           </View>
    //         )}
    //       />
    //   </View>
    //   <Text>
    //     This month:
    //   </Text>
    //   <Text style={{color:'green'}}>{"Income: $" + incomeMonth}</Text>
    //   <Text style={{color:'red'}}>{"Expense: $" + expenseMonth}</Text>
    //   <Text style={{
    //               color: total < 0
    //                 ?'red'
    //                 :'green',
    //               marginBottom: 10, 
    //             }}
    //   >
    //     {"Balance: $" + total}
    //   </Text> 
    //   </View>
    // </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: lightBlue,
  },
  header: {
    flex:1,
    justifyContent:'flex-end',
    paddingHorizontal:30,
    paddingBottom:14,
  },
  footer: {
    flex:3.7,
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
    margin:5,
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
    height:40,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
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
  },
  rowFront: {
    flexDirection:'row',
    backgroundColor: '#fff',
    alignItems:'center',
    borderRadius:5,
    height:55,
    margin:5,
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
  },
  backRightButtonRight: {
    backgroundColor:'red',
    right:0,
    borderTopRightRadius:5,
    borderBottomRightRadius:5,
  },
})



export default Home;

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
