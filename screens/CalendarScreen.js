import React, {useState, useEffect, useMemo} from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, TouchableOpacity } from 'react-native';
import styles from '../components/styles';
import { financeRef, db } from '../api/db';
import { onSnapshot, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { getUserID } from '../api/authentication';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
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
  const [expenseDays, setExpenseDays] = useState([])

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
        result[day] = {dots: [inc]}
      }
    }
    )
    return result
  }, [curDate, incomeDays, expenseDays]);

  return (
    <View style={styles.mainContainer}>
      <PressableText onPress={() => {
        console.log(incomeDays)
      }}>
        incomeDays
      </PressableText>
      <Text>
        {"Month: " + curMonth.split('-').reverse().join('-')}
      </Text>
      <Text style={{color:'green'}}>{"Income: $" + incomeMonth}</Text>
      <Text style={{color:'red'}}>{"Expense: $" + expenseMonth}</Text>
      <Text style={{
                  color: total < 0
                    ?'red'
                    :'green',
                  marginBottom: 10, 
                }}
      >
        {"Balance: $" + total}
      </Text>
      <Calendar
        onDayPress={day => {
          setCurDate(day.dateString)
          setCurMonth(day.dateString.substring(0, 7))
          }
        }
        firstDay={1}
        markedDates = {
          marked
        }
        markingType = "multi-dot"
      />
      <Text style={
        {marginTop: 20}
      }>
        {"Date: " + curDate.split('-').reverse().join('-')}
      </Text>
      <Text style={{color:'green'}}>{"Income: $" + income}</Text>
      <Text style={{color:'red'}}>{"Expense: $" + expense}</Text>
      
      
      <FlatList
        style={{height:'100%'}}
        data={finances}
        numColumns={1}
        renderItem={({item}) => (
          <View
            style={styless.container}
          >
            <View style={styless.innerContainer}>
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
      />
    </View>
  );
}

export default CalendarScreen;

const styless = StyleSheet.create({
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
})
