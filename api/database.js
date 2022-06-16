import { app } from './firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

const db = getFirestore(app);

async function getCities(db) {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}