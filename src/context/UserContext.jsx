import { useState, useContext, createContext, useEffect } from 'react';
import LocalForage from 'localforage';
import { useNavigate } from 'react-router-dom';
import {registerWithEmailAndPassword, logout,
    logInWithEmailAndPassword, getUsers,
   signInWithGoogle, getRealTimeAuthChanges
} from '../lib/init-firebase';



const UserContext = createContext({
    currentUser: null,
});

export const useUser =  () => useContext(UserContext);


export function UserContextProvider({ children }) {

    const [currentUser, setCurrentUser] = useState(null);
    const [usernameInput, setUsernameInput] = useState(null);
    const [allUsers, setAllUsers] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [localEmail, setLocalEmail] = useState('');
   
    const navigate = useNavigate();


 

    const loginUserWithGoogle = async() =>{
        try {
            setAuthError(null);
            await signInWithGoogle();
            // const res = await signInWithGoogle();
            // setCurrentUser(res);    
            // await getUsersFromDB()
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
        console.log('onLogout');
        setCurrentUser(null);
        setAllUsers(null)
    }
    
    
    const loginUser = async (email, pwd) => {
        try {
            setAuthError(null);
            await logInWithEmailAndPassword(email, pwd);
            //const res = await logInWithEmailAndPassword(email, pwd);
            //const usersDB = await getUsersFromDB();
           // const loggedInUser = usersDB[res.uid];
            //setCurrentUser(loggedInUser);  
            //await LocalForage.setItem('user-email', email);
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
            //const newUser = await registerWithEmailAndPassword(userName, email, password);
            //setCurrentUser(newUser);    
            //await getUsersFromDB()
            //LocalForage.setItem('user-email', email);
            navigate('/');
        } catch (error) {
            handleError(error)
        }
    }

  
    const logoutUser = async () => {
        logout();
        setCurrentUser(null);
    }

  

        useEffect(()=>{
            try {

            const onLoginUser = async (userDataDB) => {
                    //const loggedInUser = await getUserWithId(uid)
                    setCurrentUser(userDataDB); 
                    //console.log(loggedInUser)
                    //console.log('loggedInUser.authProvider', loggedInUser.authProvider, loggedInUser.email)
                    if(userDataDB.authProvider !== 'google.com') {
                       await LocalForage.setItem('user-email', userDataDB.email);
                     }
                     const users = await getUsersFromDB();
                     console.log(users);
                    
             }

            const unsubAuth = getRealTimeAuthChanges(
                onLoginUser, onLogoutUser, usernameInput
            );
            return () => {unsubAuth()}
            } catch (error) {
              handleError(error)
            }
        },[usernameInput])

        useEffect(() => {
            const getLocalEmail = async () => {
                const localSavedEmail = await LocalForage.getItem('user-email');
                localSavedEmail && setLocalEmail(localSavedEmail);
            }
            getLocalEmail();
        }, [currentUser])

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

