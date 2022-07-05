import { StatusBar } from 'expo-status-bar';
import React, {useState, useMemo} from 'react';
import { View, Text, TouchableOpacity, Alert, Platform, TextInput, ScrollView, Pressable, Keyboard, StyleSheet, FlatList} from 'react-native';
import { colors } from '../components/colors';
import moment from 'moment';
import { query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { financeRef,db } from '../api/db';
import { getUserID } from '../api/authentication';
// import MonthPicker from 'react-native-month-year-picker';
import ActivityRings from "react-native-activity-rings";  
import { StatusBarHeight } from '../components/constants';
import { Octicons } from '@expo/vector-icons'
import { ProgressChart } from 'react-native-chart-kit';
const { lightYellow, beige, lightBlue, darkBlue, darkYellow } = colors

const Home = ({navigation}) => {
  const username = 'Team Grape'
  let [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  let [month, setMonth] = useState(moment().format('YYYY-MM'));
  let [year, setYear] = useState(moment().format('YYYY'))

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
    { value: expenseMonth/700 > 1 ? 1 :(expenseMonth == 0? 0.0000001 : expenseMonth/700), color:darkBlue }, 
    { value: expense/50 > 1 ? 1 : (expense == 0 ? 0.0000001 : expense/50), color:darkYellow }, 
  ];

  const activityConfig = { 
    width: 150,  
    height: 150,
    ringSize:21
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
        <View style={styles.ringView}>
          <TouchableOpacity style={{flexDirection:'row'}} onPress={() => {alertChangeLimit()}}>
            <ActivityRings theme='dark' data={activityData} config={activityConfig}/> 
          </TouchableOpacity>
        </View>
        <View>
          <Text>{"Today: " + date.split('-').reverse().join('-')}</Text>
          <Text style={{color:'green'}}>{"Income: $" + income}</Text>
          <Text style={{color:'red'}}>{"Expense: $" + expense}</Text>
        </View>
        <View style={{height: 300}}>
          <FlatList
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
          />
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
    paddingBottom:20,
  },
  footer: {
    flex:3.5,
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
    flexDirection:'row',
    backgroundColor: '#fff',
    alignItems:'center',
    borderRadius:25,
    height:180,
    margin:5,
    marginBottom:10,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    elevation:5,
    padding:12
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
  }
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
