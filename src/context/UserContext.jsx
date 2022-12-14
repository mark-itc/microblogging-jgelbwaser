import { useState, useContext, createContext, useEffect } from 'react';
import LocalForage from 'localforage';
import { useNavigate } from 'react-router-dom';
import {
    registerWithEmailAndPassword, logout,
    logInWithEmailAndPassword, getUsers,
    signInWithGoogle, getRealTimeAuthChanges
} from '../lib/init-firebase';



const UserContext = createContext({
    currentUser: null,
});

export const useUser = () => useContext(UserContext);


export function UserContextProvider({ children }) {

    const [currentUser, setCurrentUser] = useState(null);
    const [usernameInput, setUsernameInput] = useState(null);
    const [allUsers, setAllUsers] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [localEmail, setLocalEmail] = useState('');

    const navigate = useNavigate();


    const loginUserWithGoogle = async () => {
        try {
            setAuthError(null);
            await signInWithGoogle();
            navigate('/');
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
        setAllUsers(null)
    }


    const loginUser = async (email, pwd) => {
        try {
            setAuthError(null);
            await logInWithEmailAndPassword(email, pwd);
            navigate('/');
        } catch (error) {
            handleError(error)
        }
    }


    const getUsersFromDB = async () => {
        const usersDB = await getUsers();
        setAllUsers(usersDB);
        return usersDB;
    }


    const signUpUser = async (userName, email, password) => {
        try {
            setUsernameInput(userName);
            await registerWithEmailAndPassword(userName, email, password);
            navigate('/');
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
                await getUsersFromDB();
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

    const value = {
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

