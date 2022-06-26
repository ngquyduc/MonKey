import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, TouchableOpacity } from 'react-native';
import styles from '../components/styles';
import { financeRef, db } from '../api/db';
import { onSnapshot, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { getUserID } from '../api/authentication';

const Calendar = (props) => {
  const [finances, setFinances] = useState([])
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const userQuery = query(financeRef, where("user", "==", getUserID()), orderBy("date", "desc"), orderBy("time", "desc"))
    onSnapshot(userQuery,
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
        setTotal(totalIncome - totalExpense)
      }
    )
  }, [])

  return (
    <View style={styles.mainContainer}>
      <Text style={{color:'green'}}>{"Income: $" + income}</Text>
      <Text style={{color:'red'}}>{"Expense: $" + expense}</Text>
      <Text style={{
                  color: total < 0
                    ?'red'
                    :'green',
                }}
      >
        {"Total: $" + total}
      </Text>
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

export default Calendar;

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
