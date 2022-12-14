// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, query, getDocs, collection, where, addDoc } from "firebase/firestore";
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

//initialize Auth
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();



const getUsers = async () => {
  const users = {};
  const usersColRef = collection(db, "users");
  const response = await getDocs(usersColRef);
  response.docs.forEach(doc => {
    const userDb = doc.data();
    users[userDb.uid] = {
      userName: userDb.userName,
      photoURL: userDb.photoURL,
      uid: userDb.uid
    };
  });
  return { ...users }
}



const getUserWithId = async (id) => {
  const q = query(collection(db, "users"), where("uid", "==", id));
  const response = await getDocs(q);
console.log(response.docs);
  if (response.docs.length === 0) return;
  if (response.docs.length > 1) {
    throw new Error('More than 1 user with same id in Firestore db');
  }
  const user = response.docs[0].data();
  return user;
}


const signInWithGoogle = async () => {
  await signInWithPopup(auth, googleProvider);
  // const res = await signInWithPopup(auth, googleProvider);
  // const user = res.user;
  // const userRecord = {
  // uid: user.uid,
  // userName: user.displayName,
  // authProvider: "google",
  // email: user.email,
  // photoURL: user.photoURL
  // }
  // const existingUser = await getUserWithId(user.uid);
  // if (!existingUser) {
  //  await addDoc(collection(db, "users"), userRecord);
  // }
  // return userRecord;
};



const logInWithEmailAndPassword = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  
  // const response = await signInWithEmailAndPassword(auth, email, password);
  // return { uid: response.user.uid }
};



const registerWithEmailAndPassword = async (userName, email, password) => {
  await createUserWithEmailAndPassword(auth, email, password);
 
  //const res = await createUserWithEmailAndPassword(auth, email, password);
  // const user = res.user;
  // const userRecord = {
  //   uid: user.uid,
  //   photoURL: user.photoURL,
  //   userName,
  //   authProvider: "password",
  //   email,
  // }
  // await addDoc(collection(db, "users"), userRecord);
  // return userRecord;
};




const sendPasswordReset = async (email) => {
  await sendPasswordResetEmail(auth, email);
  alert("Password reset link sent!");
};

const logout = () => {
  console.log('logout called');
  signOut(auth);
};


const getRealTimeAuthChanges = (onLogin, onLogout, usernameInput) => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    
    // User is signed in
    if (user) {
      console.log('usernameInput', usernameInput);
      console.log('user.displayName', user.displayName);
      console.log('user.displayName', user.uid);
      //const loggedInUser = await getUserWithId(user.uid);
      let userDataDB = await getUserWithId(user.uid);
      
      if (!userDataDB) {
        userDataDB = {
          uid: user.uid,
          userName: user.displayName ? user.displayName : usernameInput,
          authProvider: user.providerData[0].providerId,
          email: user.email,
          photoURL: user.photoURL
        }
        await addDoc(collection(db, "users"), userDataDB)
      }
      console.log('loggedInUser ', userDataDB);
      await onLogin(userDataDB);
    } else {
      // User is signed out
      onLogout()
    }
  });
  return unsubscribe
}




export {
  auth,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getUsers,
  getRealTimeAuthChanges,
  getUserWithId
};
