import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import styles from '../components/styles';
import { PieChart } from "react-native-chart-kit";
import { ScreenWidth } from '../components/constants';
import { onSnapshot, query, where } from 'firebase/firestore';
import { getUserID } from '../api/authentication';
import { financeRef } from '../api/db';

const Stats = (props) => {
  const [income, setIncome] = useState({})
  const [expense, setExpense] = useState({})
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpense, setTotalExpense] = useState(0)

  useEffect(() => {
    const q = query(financeRef, where("user", "==", getUserID()))
    onSnapshot( q,
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
        setTotalIncome(totalIncome)
        setTotalExpense(totalExpense)
      }
    )
  }, [])

  const data = [
    {
      name: "Seoul",
      population: 21500000,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Toronto",
      population: 2800000,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Beijing",
      population: 527612,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "New York",
      population: 8538000,
      color: "#ffffff",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
  ];

  return (
    <View style={styles.mainContainerInnerScreen}>
      <Text style={{color:'green'}}>{"Income: " + totalIncome}</Text>
      <Text style={{color:'red'}}>{"Expense: " + totalExpense}</Text>
      <PieChart
        data={data}
        width={ScreenWidth}
        height={300}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        center={[10, 10]}
        absolute
      />
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