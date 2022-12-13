// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, query, getDocs, collection, where, addDoc } from "firebase/firestore";
import {
  getAuth, GoogleAuthProvider, signInWithPopup,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, signOut,
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
  try {
    const users = {};
    const usersColRef = collection(db, "users");
    const response = await getDocs(usersColRef);
    response.docs.forEach(doc => {
      const userDb = doc.data();
      users[userDb.uid] = {
        userName: userDb.userName,
        photoURL: userDb.photoURL
      };
    });
    return {users: {...users}}
  } catch (err) {
    console.log(err)
    return { error: err.message };
  }
}


const getUserWithId = async (id) => {
  const q = query(collection(db, "users"), where("uid", "==", id));
  const response = await getDocs(q);

  if (response.docs.length === 0) return;
  if (response.docs.length > 1) {
    throw new Error('More than 1 user with same id in Firestore db');
  }
  const user = response.docs[0].data();
  return user;
}

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
      const userRecord = {
        uid: user.uid,
        userName: user.displayName,
        authProvider: "google",
        email: user.email,
      }
      const existingUser = await getUserWithId(user.uid);
    if (!existingUser) {
      await addDoc(collection(db, "users"), userRecord);
    }
    return { user: userRecord };;
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    //console.log(response.user);
    //const user = await getUserWithId(response.user.uid)
    return {uid: response.user.uid}
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
};

const registerWithEmailAndPassword = async (userName, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const userRecord = {
      uid: user.uid,
      photoURL: user.photoURL,
      userName,
      authProvider: "local",
      email,
    }
    await addDoc(collection(db, "users"), userRecord);
    return { user: userRecord };
  } catch (err) {
    console.error(err);
    return { error: err.message };

  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
};

const logout = () => {
  signOut(auth);
};
export {
  auth,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getUsers
};
