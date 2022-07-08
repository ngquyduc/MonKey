import React, {useState, useEffect, useMemo} from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { financeRef, db } from '../api/db';
import { onSnapshot, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { getUserID } from '../api/authentication';
import { Calendar } from 'react-native-calendars';
import { StatusBarHeight } from '../components/constants';
import moment from 'moment';
import { colors } from '../components/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { SwipeListView } from 'react-native-swipe-list-view';
const {beige, brown, darkBlue, lightBlue, darkYellow,lighterBlue} = colors;
import PressableText from '../components/Containers/PressableText';

const CalendarScreen = (props) => {
  const [curDate, setCurDate] = useState(moment().format('YYYY-MM-DD'))
  const [curMonth, setCurMonth] = useState(moment().format('YYYY-MM-DD').substring(0, 7))
  const [finances, setFinances] = useState([])
  const [financesMonth, setFinancesMonth] = useState([])
  const [income, setIncome] = useState(0)
  const [incomeMonth, setIncomeMonth] = useState(0)
  const [incomeDays, setIncomeDays] = useState([])
  const [expense, setExpense] = useState(0)
  const [expenseMonth, setExpenseMonth] = useState(0)
  const [total, setTotal] = useState(0)
  const [balanceDay, setBalanceDay] = useState(0)
  const [expenseDays, setExpenseDays] = useState([])
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  useMemo(() => {
    const dayQuery = query(financeRef, where("user", "==", getUserID()), where('date', '==', curDate), orderBy("time", "desc"))
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
        setBalanceDay(totalIncome-totalExpense)
      }
    )
    const monthQuery = query(financeRef, where("user", "==", getUserID()), where('month', "==", curMonth))
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
  }, [curDate, curMonth])
  /*********** Calendar marked dots config ***********/
  const exp = {color:'red'}
  const inc = {key:'income', color:'green'}

  const marked = useMemo(() => {
    const result = {}
    result[curDate] = {
      selected: true,
      disableTouchEvent: true,
    }
    incomeDays.forEach((day) => {
      if (result[day]) {
        result[day].dots = [inc]
      } else {
        result[day] = {dots: [inc]}
      }
    }
    )
    expenseDays.forEach((day) => {
      if (result[day]) {
        if (result[day].dots) {
          if (result[day].dots.includes(exp)) {
            // do not add
          } else {
            result[day].dots.push(exp)
          }
        }
        else {
          result[day].dots = [exp]
        }
      } else {
        result[day] = {dots: [exp]}
      }
    }
    )
    return result
  }, [curDate, incomeDays, expenseDays]);

  /*************** Function to alert when deleting ***************/
  const alertDelete = (rowMap, rowKey, id) => {
    Alert.alert("Delete this record?","", [
      {text: 'Cancel', onPress: () => {closeRow(rowMap, rowKey)}},
      {text: 'Delete', onPress: () => {deleteRow(id)}}
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

  const renderHiddenItem = (data, rowMap) => {
    return (
      <HiddenItemWithActions
        data={data}
        rowMap={rowMap}
        onEdit={()=>{
          setVisibleEdit(true) 
          setInprogressCategory(data.item.category)
          setInprogressAmount(data.item.amount)
          setInprogressNote(data.item.note)
          setInprogressId(data.item.id)
        }}
        onDelete={()=>alertDelete(rowMap, data.item.key, data.item.id)}
      />
    )
  }

  const VisibleItem = props => {
    const {data} = props;
    return (
      <View style={[styles.rowFront, {backgroundColor: data.item.type=='income' ? '#e2f5e2' : '#fdddcf'}]}>
        <View style={{flex:3, paddingLeft:15, flexDirection:'column'}}>
          <View style={{flexDirection:'row', marginBottom:3}}>
            <View style={{marginRight:10}}>
              <MaterialCommunityIcons name={data.item.icon} color={data.item.color} size={20}/>
            </View>
            <Text style={styles.categoryText}>{data.item.category}</Text>
          </View>
          <View>
            <Text style={styles.noteText}>{data.item.note}</Text>
          </View>
        </View>
        <View style={{flex:1.5, alignItems:'flex-end', justifyContent:'center', paddingRight:15}}>
          <Text style={styles.amountText}>{'$' + data.item.amount}</Text>
        </View>
      </View>
    )
  }

  const renderItem = (data, rowMap) => {
    return <VisibleItem data={data}/>
  }
  return (
    <View style={styles.mainContainerInnerScreen}>
      <View style={[styles.header, {marginBottom:5}]}>
        <Text style={styles.boldBlueHeaderText}>Calendar</Text>
      </View>
      <View style={styles.calendarView}>
        <Calendar
          onDayPress={day => {
            setCurDate(day.dateString)
            setCurMonth(day.dateString.substring(0, 7))
            }
          } 
          hideArrows={false}
          firstDay={1}
          markedDates = {marked}
          markingType = "multi-dot"
          onMonthChange={month=> {setCurMonth(month.dateString.substring(0, 7))}}
          enableSwipeMonths={true}
          renderHeader={date => {
            return (
            <View style={{width:318,alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontSize:20, paddingBottom:6, fontWeight:'600'}}>{months[parseInt(curMonth.substring(5,7))-1] + ' ' + curMonth.substring(0,4)}</Text>
              <View style={{flexDirection:'row', marginBottom:10}}>
                <View style={[styles.incomeexpenseView, {backgroundColor:'#e2f5e2'}]}>
                  {/* <FontAwesome name='plus-circle' color={'#26b522'} size={15}/> */}
                  <Text style={{color:'#26b522', fontSize:14, fontWeight:'500'}}>{" Income: $" + incomeMonth}</Text>
                </View>
                <View style={[styles.incomeexpenseView, {backgroundColor:'#fdddcf'}]}>
                  {/* <FontAwesome name='minus-circle' color={'#ef5011'} size={15}/> */}
                  <Text style={{color:'#ef5011', fontSize:14, fontWeight:'500'}}>{" Expense: $" + expenseMonth}</Text>
                </View>
                <View style={[styles.incomeexpenseView, {backgroundColor:'#e6e6e6'}]}>
                  {/* <Entypo name="flickr-with-circle" size={15} color={'#494949'}/> */}
                  <Text style={{color: '#494949', fontSize:14, fontWeight:'500'}}>{" Balance: $" + total}</Text>
                </View>
              </View>
            </View>
            )
          }}
        />
      </View>
      <View style={{alignItems:'center', justifyContent:'center', paddingBottom:7}}>
        <Text style={{fontSize:16, fontWeight:'700', color:darkBlue}}>{"Date: " + curDate.split('-').reverse().join('-')}</Text>
      </View>
      <View>
        <View style={{flexDirection:'row', marginHorizontal:10, marginBottom:10}}>
          <View style={[styles.incomeexpenseView, {backgroundColor:'#e2f5e2'}]}>
            <Text style={{color:'#26b522', fontSize:14, fontWeight:'500'}}>{" Income: $" + income}</Text>
          </View>
          <View style={[styles.incomeexpenseView, {backgroundColor:'#fdddcf'}]}>
            <Text style={{color:'#ef5011', fontSize:14, fontWeight:'500'}}>{" Expense: $" + expense}</Text>
          </View>
          <View style={[styles.incomeexpenseView, {backgroundColor:'#e6e6e6'}]}>
            <Text style={{color: '#494949', fontSize:14, fontWeight:'500'}}>{" Balance: $" + balanceDay}</Text>
          </View>
        </View>
      </View>
      <View style={{height: 285}}>
        <SwipeListView //add data={...}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-150}
          disableRightSwipe
          showsVerticalScrollIndicator={true}
        />
      </View>
      {/* <FlatList
        style={{height:'100%'}}
        data={finances}
        numColumns={1}
        renderItem={({item}) => (
          <View
            style={styles.container}
          >
            <View style={styles.innerContainer}>
              <Text>
                {item.date}
              </Text>
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
  );
}

export default CalendarScreen;

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
    backgroundColor:lighterBlue,
    borderBottomColor:'#808080',
    borderBottomWidth:1,
    paddingTop:3,
    height: StatusBarHeight + 42,
  },
  boldBlueHeaderText: {
    fontSize: 34,
    color: darkBlue,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  calendarView: {
    margin:5,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:3,
    elevation:5,
  },
  incomeexpenseView: {
    flexDirection:'row',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
    marginHorizontal:3,
    marginBottom:5,
    height:40,
    shadowColor:'#999',
    shadowOffset: {width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
  },
})
