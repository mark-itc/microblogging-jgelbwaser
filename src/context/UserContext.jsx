import { useState, useContext, createContext, useEffect } from 'react';
import LocalForage from 'localforage';
import { useNavigate } from 'react-router-dom';
import {registerWithEmailAndPassword, logout,
    logInWithEmailAndPassword, getUsers,
   signInWithGoogle
} from '../lib/init-firebase';



const UserContext = createContext({
    currentUser: null,
});

export const useUser =  () => useContext(UserContext);


export function UserContextProvider({ children }) {

    const [currentUser, setCurrentUser] = useState(null);
    const [allUsers, setAllUsers] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [localEmail, setLocalEmail] = useState(null);
   
    const navigate = useNavigate();

  

    useEffect(() => {
        const getLocalEmail = async () => {
            const localSavedEmail = await LocalForage.getItem('user-email');
            localSavedEmail && setLocalEmail(localSavedEmail);
        }
        getLocalEmail();
    }, [])


    const loginUserWithGoogle = async() =>{
        setAuthError(null);
        const res = await signInWithGoogle()
        if(res && res.error) {return setAuthError(res.error)} 
        res.user && setCurrentUser(res.user);    
        await setDbUsers()
        LocalForage.setItem('user-email', res.user.email);
        navigate('/');
    }

    const loginUser = async (email, pwd) => {
        setAuthError(null);
        const res = await logInWithEmailAndPassword(email, pwd);
        if(res && res.error) {return setAuthError(res.error)} 
        const usersDB = await setDbUsers();
        const loggedInUser = usersDB[res.uid];
        setCurrentUser(loggedInUser);  
        await LocalForage.setItem('user-email', email);
        navigate('/');  
    }

    const setDbUsers = async () => {
        const usersDB = await getUsers();
        if(usersDB.error) {return setAuthError(usersDB.error)}
        setAllUsers(usersDB.users);
        return usersDB.users
    }

    const signUpUser = async (userName, email, password) => {
        setAuthError(null);
        const res = await registerWithEmailAndPassword(userName, email, password);
        if(res && res.error) {return setAuthError(res.error)}
        res.user && setCurrentUser(res.user);    
        await setDbUsers()
        LocalForage.setItem('user-email', email);
        navigate('/');
    }

  
    const logoutUser = async () => {
        logout();
        await LocalForage.setItem('user-email', '');
        setCurrentUser('')
    }

    const value ={
        currentUser, 
        authError,
        localEmail,
        allUsers,
        loginUser, 
        setAuthError, 
        signUpUser,
        logoutUser,
        loginUserWithGoogle
        }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

