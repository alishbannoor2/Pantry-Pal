// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsgLm5yh2yp2u3D6uXcdYv8POOJebovr4",
  authDomain: "inventory-management-2b744.firebaseapp.com",
  projectId: "inventory-management-2b744",
  storageBucket: "inventory-management-2b744.appspot.com",
  messagingSenderId: "322817313569",
  appId: "1:322817313569:web:6a925a6b4240bcb49ccc60",
  measurementId: "G-7QC2RJD8YW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore=getFirestore(app);

export {firestore};