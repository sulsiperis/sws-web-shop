// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCK2PBxNhcJHlrZxyhHDYyy3q0q_mcewv0",
  authDomain: "sws-sulsiperis.firebaseapp.com",
  projectId: "sws-sulsiperis",
  storageBucket: "sws-sulsiperis.appspot.com",
  messagingSenderId: "236942040321",
  appId: "1:236942040321:web:809bd85d1e35e024c38f00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); //reference needed for delete note func
/* export const notesCollection = collection(db, "notes") */