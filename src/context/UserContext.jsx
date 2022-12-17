import { useState, useContext, createContext, useEffect } from 'react';
import LocalForage from 'localforage';
import {
    registerWithEmailAndPassword, logout,
    logInWithEmailAndPassword, 
    signInWithGoogle, getRealTimeAuthChanges,
    getRealTimeUsers
} from '../lib/init-firebase';



const UserContext = createContext({
    currentUser: null,
});

export const useUser = () => useContext(UserContext);


export function UserContextProvider({ children }) {

    const [currentUser, setCurrentUser] = useState(null);
    const [usernameInput, setUsernameInput] = useState(null);
    const [usersMap, setUsersMap] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [localEmail, setLocalEmail] = useState('');




    const loginUserWithGoogle = async () => {
        try {
            setAuthError(null);
            await signInWithGoogle();
        } catch (error) {
            handleError(error)
        }
    }

    const handleError = (error) => {
        console.log(error);
        setAuthError(error.message);
    }

    const onLogoutUser = () => {
        setCurrentUser(null);
        setUsersMap(null)
    }


    const loginUser = async (email, pwd) => {
        try {
            setAuthError(null);
            await logInWithEmailAndPassword(email, pwd);
        } catch (error) {
            handleError(error)
        }
    }


    const signUpUser = async (userName, email, password) => {
        try {
            setUsernameInput(userName);
            await registerWithEmailAndPassword(userName, email, password);
        } catch (error) {
            handleError(error)
        }
    }


    const logoutUser = async () => {
        logout();
        setCurrentUser(null);
    }


    useEffect(() => {
        try {
            const onLoginUser = async (userDataDB) => {
                setCurrentUser(userDataDB);
                if (userDataDB.authProvider !== 'google.com') {
                    await LocalForage.setItem('user-email', userDataDB.email);
                }
               // await getUsersFromDB();
            }

            const unsubAuth = getRealTimeAuthChanges(
                onLoginUser, onLogoutUser, usernameInput
            );
            return () => { unsubAuth() }
        } catch (error) {
            handleError(error)
        }
    }, [usernameInput])


    useEffect(() => {
        const getLocalEmail = async () => {
            const localSavedEmail = await LocalForage.getItem('user-email');
            localSavedEmail && setLocalEmail(localSavedEmail);
        }
        getLocalEmail();
    }, [currentUser])


    useEffect(() => {
        if (!currentUser) return
        try {
            const disconnect = getRealTimeUsers(setUsersMap);
            return () => { disconnect() }
        } catch (error) {
            handleError()
        }
    }, [currentUser]);


    const value = {
        currentUser,
        authError,
        localEmail,
        usersMap,
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

