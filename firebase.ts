import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDBAH-ezb7FVcOuDuQ_Sk6RgOHO1WgPj9I',
  authDomain: 'mamon-finance.firebaseapp.com',
  projectId: 'mamon-finance',
  storageBucket: 'mamon-finance.appspot.com',
  messagingSenderId: '917736679007',
  appId: '1:917736679007:web:7db552ed7a6c705c841dea',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();

export { app, db };
