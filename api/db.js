import { app } from './firebase';
import { 
  getFirestore, collection, getDocs, doc, 
  Timestamp, addDoc, deleteDoc,
  docRef, onSnapshot, 
} from 'firebase/firestore';
import { Alert } from 'react-native';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';

// init firestore
const db = getFirestore(app);

// collection ref
const incomeRef = collection(db, 'income')
const expenseRef = collection(db, 'expense')

const handleExpenseSubmit = async (date, amount, note, category) => {
  try {
    const docRef = await addDoc(expenseRef, {
      date: date,
      amount: amount,
      note: note,
      category: category,
      time: Timestamp.now()
    })
    console.log('Added %s to expense', docRef.id); 
  } catch (err) {
    Alert.alert(err)
  }
}

const handleIncomeSubmit = async (date, amount, note, category) => {
  try {
    const docRef = await addDoc(incomeRef, {
      date: date,
      amount: amount,
      note: note,
      category: category,
      time: Timestamp.now()
    })
    console.log('Added %s to income', docRef.id); 
  } catch (err) {
    Alert.alert(err)
  }
}

const unsub = onSnapshot(expenseRef, (snapshot) => {
  expenses = []
  snapshot.docs.forEach((doc) => {
    expenses.push({...doc.data()})
  })
  console.log(expenses)
})
export {handleExpenseSubmit, handleIncomeSubmit, unsub}