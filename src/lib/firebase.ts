import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAXNLv7l3yPBu289isIsJnm4nqtCWs9SDU",
  authDomain: "hellomood-e3d4e.firebaseapp.com",
  projectId: "hellomood-e3d4e",
  storageBucket: "hellomood-e3d4e.appspot.com", 
  messagingSenderId: "872792372604",
  appId: "1:872792372604:web:31eccdf256cb135f8860f9",
  measurementId: "G-RY135F7LTC",
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
