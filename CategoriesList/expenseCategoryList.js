import React, {useState} from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { getUserID } from "../api/authentication";
import { db } from "../api/db";

const [expenseCategoryList, setExpenseCategoryList] = useState({})
const expenseCategoryRef = collection(db, 'Input Category/Expense/' + getUserID())

onSnapshot(expenseCategoryRef, (snapshot) => {
  let expenseCategories = {}
  snapshot.docs.forEach((doc) => {
    expenseCategories[doc.data().name] = doc.data().color
  })
  setExpenseCategoryList(expenseCategories)
  console.log(expenseCategoryList)
})

export default expenseCategoryList;