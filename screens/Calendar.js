import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import styles from '../components/styles';
import { expenseRef } from '../api/db';
import { onSnapshot } from 'firebase/firestore';

const Calendar = (props) => {
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    onSnapshot(expenseRef,
      (snapShot) => {
        const expenses = []
        snapShot.forEach((doc) => {
          expenses.push({
            date: doc.data().date,
            amount: doc.data().amount,
            note: doc.data().note,
            category: doc.data().category
          })
        })
        setExpenses(expenses)
      }
    )
  }, [])

  return (
    <View style={styles.mainContainer}>
      <FlatList
        style={{height:'100%'}}
        data={expenses}
        numColumns={1}
        renderItem={({item}) => (
          <Pressable
            style={styless.container}
          >
            <View style={styless.innerContainer}>
              <Text>{item.date}</Text>
              <Text>{item.category}</Text>
              <Text>{item.note}</Text>
              <Text>{item.amount.toString()}</Text>
            </View>
          </Pressable>
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
