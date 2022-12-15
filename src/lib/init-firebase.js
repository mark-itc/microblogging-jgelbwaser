// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, query, getDocs, collection, where, addDoc, onSnapshot } from "firebase/firestore";
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, signOut, onAuthStateChanged
} from "firebase/auth";

//app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEOhCZn9WTdSYg1WchM5UynRt3hj7WvRc",
  authDomain: "microblogging-caa27.firebaseapp.com",
  projectId: "microblogging-caa27",
  storageBucket: "microblogging-caa27.appspot.com",
  messagingSenderId: "816415676622",
  appId: "1:816415676622:web:a9190bec809204ecd7d89f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore

export const db = getFirestore(app);
const auth = getAuth(app);
const usersColRef = collection(db, "users");
const googleProvider = new GoogleAuthProvider();




const getUserWithId = async (id) => {
  const q = query(usersColRef, where("uid", "==", id));
  const response = await getDocs(q);
  if (response.docs.length === 0) return;
  if (response.docs.length > 1) {
    throw new Error('More than 1 user with same id in Firestore db');
  }
  const user = response.docs[0].data();
  return user;
}

const signInWithGoogle = async () => {
  await signInWithPopup(auth, googleProvider);
};


const logInWithEmailAndPassword = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
};


const registerWithEmailAndPassword = async (userName, email, password) => {
  await createUserWithEmailAndPassword(auth, email, password);
};


const sendPasswordReset = async (email) => {
  await sendPasswordResetEmail(auth, email);
  alert("Password reset link sent!");
};

const logout = () => {
  signOut(auth);
};


const getRealTimeAuthChanges = (onLogin, onLogout, usernameInput) => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    
    // User is signed in
    if (user) {
      let userDataDB = await getUserWithId(user.uid);
      
      if (!userDataDB) {
        userDataDB = {
          uid: user.uid,
          userName: user.displayName ? user.displayName : usernameInput,
          authProvider: user.providerData[0].providerId,
          email: user.email,
          photoURL: user.photoURL
        }
        await addDoc(usersColRef, userDataDB)
      }
      await onLogin(userDataDB);
    } else {
      // User is signed out
      onLogout()
    }
  });
  return unsubscribe
}


const getRealTimeUsers = (setAllUsers) => {
      const unsubscribe = onSnapshot(usersColRef, snapshot => {
          const users = {}
          snapshot.docs.forEach(doc => {
            const userDb = doc.data();
            users[userDb.uid] = {
              userName: userDb.userName,
              photoURL: userDb.photoURL,
              uid: userDb.uid
            };
          });
          setAllUsers(users);
          console.log(users);
      });
      return () => { unsubscribe() };
}


export {
  auth,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getRealTimeAuthChanges,
  getUserWithId,
  getRealTimeUsers,
};
