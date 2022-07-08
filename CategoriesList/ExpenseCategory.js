import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../api/db";

ExpenseCategory = {}

const q = collection(db, 'Input Category/Expense/sMXKiA9zaWTx6R2KEv6W3IPubWt1')
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const cities = {};
  querySnapshot.forEach((doc) => {
      cities[doc.data().name] = {
        name: doc.data().name,
        color: doc.data().color,
        icon: doc.data().icon,
        isEdit: false
      };
  });
  ExpenseCategory = cities
  console.log("list: ", ExpenseCategory);
});

export default { ExpenseCategory };
// export default  = [
//   {name: 'Food', icon: 'food', color: '#979797', isEdit: false},
//   {name: 'Clothes', icon: 'tshirt-crew', color: '#0100c8', isEdit: false},
//   {name: 'Entertain', icon: 'nintendo-game-boy', color: '#feb080', isEdit: false},
//   {name: 'Education', icon: 'notebook-edit-outline', color: '#e1fe64', isEdit: false},
//   {name: 'Subcription', icon: 'youtube-subscription', color: '#0d9ff5', isEdit: false},
//   {name: 'Electricity', icon: 'lightning-bolt', color: '#980ba7', isEdit: false},
//   {name: 'Medical', icon: 'medical-bag', color: '#4ed807', isEdit: false},
//   {name: 'Telephone', icon: 'cellphone', color: '#000000', isEdit: false},
//   {name: 'Travel', icon: 'airplane', color: '#fe0500', isEdit: false},
//   {name: 'Cosmestic', icon: 'lipstick', color: '#fd568e', isEdit: false},
//   {name: 'Internet', icon: 'wifi', color: '#fc800c', isEdit: false},
//   {name: 'Fitness', icon: 'weight-lifter', color: '#41d2c1', isEdit: false},
//   {name: 'Edit', icon: 'lead-pencil', isEdit: true},
// ];