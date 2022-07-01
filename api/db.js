import { app } from './firebase';
import { 
  getFirestore, collection, getDocs, doc, 
  Timestamp, addDoc, deleteDoc,
  docRef, onSnapshot, 
  query, where, orderBy
} from 'firebase/firestore';
import { Alert } from 'react-native';
import { getUserID } from './authentication';

// init firestore
export const db = getFirestore(app);

// collection ref
const financeRef = collection(db, 'finance')

const handleExpenseSubmit = async (date, amount, note, category) => {
  try {
    const docRef = await addDoc(financeRef, {
      date: date,
      month: date.substring(0, 7), 
      amount: amount,
      note: note,
      category: category,
      time: Timestamp.now(),
      type: 'expense',
      user: getUserID(),
    })
  } catch (err) {
    Alert.alert(err.message)
  }
}

const handleIncomeSubmit = async (date, amount, note, category) => {
  try {
    const docRef = await addDoc(financeRef, {
      date: date,
      month: date.substring(0, 7), 
      amount: amount,
      note: note,
      category: category,
      time: Timestamp.now(),
      type: 'income',
      user: getUserID(),
    })
  } catch (err) {
    Alert.alert(err.message)
  }
}

export {financeRef, handleExpenseSubmit, handleIncomeSubmit}