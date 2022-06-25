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

// query 
// export const userQuery = query(financeRef, where("user", "==", getUserID()), orderBy("date", "desc"))

const handleExpenseSubmit = async (date, amount, note, category) => {
  try {
    const docRef = await addDoc(financeRef, {
      date: date,
      amount: amount,
      note: note,
      category: category,
      time: Timestamp.now(),
      type: 'expense',
      user: getUserID(),
    })
    console.log('Added %s to expense', docRef.id); 
  } catch (err) {
    Alert.alert(err)
  }
}

const handleIncomeSubmit = async (date, amount, note, category) => {
  try {
    const docRef = await addDoc(financeRef, {
      date: date,
      amount: amount,
      note: note,
      category: category,
      time: Timestamp.now(),
      type: 'income',
      user: getUserID(),
    })
    console.log('Added %s to income', docRef.id); 
  } catch (err) {
    Alert.alert(err)
  }
}

export {financeRef, handleExpenseSubmit, handleIncomeSubmit}