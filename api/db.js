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
      date: date, // format (YYYY-MM-DD)
      month: date.substring(0, 7), 
      year: date.substring(0, 4),
      amount: amount,
      note: note,
      category: category,
      time: Timestamp.now(),
      type: 'expense',
      user: getUserID(),
    })
    .then(Alert.alert('Expense noted'))
  } catch (err) {
    Alert.alert(err.message)
  }
}

const handleIncomeSubmit = async (date, amount, note, category) => {
  try {
    const docRef = await addDoc(financeRef, {
      date: date,
      month: date.substring(0, 7), 
      year: date.substring(0, 4),
      amount: amount,
      note: note,
      category: category,
      time: Timestamp.now(),
      type: 'income',
      user: getUserID(),
    })
    .then(Alert.alert('Income noted'))
  } catch (err) {
    Alert.alert(err.message)
  }
}

export const AddExpenseCategory = (catName, icon, color) => {
  const collectionPath = 'Input Category/Expense/' + getUserID()
  const expenseCategoryRef = collection(db, collectionPath)
  addDoc(expenseCategoryRef, {
    name: catName,
    icon: icon,
    color: color,
  });
}

// export const ExpenseCategoryRef = collection(db, 'Input Category/Expense/default')

export const AddIncomeCategory = (catName, icon, color) => {
  const collectionPath = 'Input Category/Income/' + getUserID()
  const incomeCategoryRef = collection(db, collectionPath)
  addDoc(incomeCategoryRef, {
    name: catName,
    icon: icon,
    color: color,
  });
}


export {financeRef, handleExpenseSubmit, handleIncomeSubmit}