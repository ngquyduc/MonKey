import { addDoc, collection } from 'firebase/firestore'
import { getUserID } from './authentication'
import db from './db'

export const ratingSubmit = async (score, feedback) => {
  try {
    const ratingRef = collection(db, 'Ratings/')
    const docRef = await addDoc(ratingRef, {
      user: getUserID(),
      score: score,
      feedback: feedback
    })
    console.log(docRef.id)
  } catch {
    (err) => console.log(err.message)
  }
}
