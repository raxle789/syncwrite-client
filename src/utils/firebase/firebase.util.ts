import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
// import {
//   getFirestore,
//   doc,
//   getDoc,
//   setDoc,
//   deleteDoc,
//   collection,
// } from "firebase/firestore";
import "firebase/compat/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyB-hGV4BHj7otKsrUP1EQ7l29jLKdeM6bQ",
//   authDomain: "bold-f7fa9.firebaseapp.com",
//   projectId: "bold-f7fa9",
//   storageBucket: "bold-f7fa9.appspot.com",
//   messagingSenderId: "92251694375",
//   appId: "1:92251694375:web:efc2b04cbf4b9dee62b502",
// };
// const firebaseApp = initializeApp(firebaseConfig);

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr69_FjRq9w3pOn1MsbY-kSXW7jGNz9ms",
  authDomain: "syncwrite-sw789.firebaseapp.com",
  projectId: "syncwrite-sw789",
  storageBucket: "syncwrite-sw789.appspot.com",
  messagingSenderId: "50321623688",
  appId: "1:50321623688:web:3c2b5fbdc7d06d53402d3d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const PopupSignIn = () => signInWithPopup(auth, provider);
export const RedirectSignIn = () => signInWithRedirect(auth, provider);

export const signOutUser = async () => await signOut(auth);
