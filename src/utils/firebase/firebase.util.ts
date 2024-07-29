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

// Your web app's Firebase configuration
const firebaseConfig = {
  // your_firebase_config
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
