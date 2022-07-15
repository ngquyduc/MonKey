import { app } from './firebase';
import { 
  getFirestore, collection, getDocs, doc, 
  Timestamp, addDoc, deleteDoc,
  docRef, onSnapshot, 
  query, where, orderBy, setDoc
} from 'firebase/firestore';
import { Alert } from 'react-native';
import { getUserID } from './authentication';

export const db = getFirestore(app);

export const handleExpenseSubmit = async (date, amount, note, category) => {
  try {
    const expensePath = 'Finance/' + getUserID() + '/Expense'
    const expenseRef = collection(db, expensePath)
    await addDoc(expenseRef, {
      date: date.substring(8, 10),
      month: date.substring(5, 7), 
      year: date.substring(0, 4), 
      amount: amount,
      note: note,
      category: category,
      notedAt: Timestamp.now(),
    })
    .then()
  } catch (err) {
    Alert.alert(err.message)
  }
}

export const handleIncomeSubmit = async (date, amount, note, category) => {
  try {
    const incomePath = 'Finance/' + getUserID() + '/Income'
    const incomeRef = collection(db, incomePath)
    await addDoc(incomeRef, {
      date: date.substring(8, 10),
      month: date.substring(5, 7), 
      year: date.substring(0, 4),
      amount: amount,
      note: note,
      category: category,
      notedAt: Timestamp.now(),
    })
    .then()
  } catch (err) {
    Alert.alert(err.message)
  }
}

export const AddExpenseCategory = (catName, icon, color) => {
  const expenseCategoryPath = 'Input Category/Expense/' + getUserID()
  const expenseCategoryRef = collection(db, expenseCategoryPath)
  addDoc(expenseCategoryRef, {
    name: catName,
    icon: icon,
    color: color,
  });
}

export const AddIncomeCategory = (catName, icon, color) => {
  const incomeCategoryPath = 'Input Category/Income/' + getUserID()
  const incomeCategoryRef = collection(db, incomeCategoryPath)
  addDoc(incomeCategoryRef, {
    name: catName,
    icon: icon,
    color: color,
  });
}

export const EditExpenseLimit = (amount) => {
  const expenseLimitPath = 'Limit'
  const expenseLimitRef = doc(db, expenseLimitPath, getUserID())
  setDoc(expenseLimitRef, {
    limit: amount
  })
}
