import { useState, createContext, useEffect } from 'react';
import LocalForage from 'localforage';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

function UserContextProvider({ children }) {


    const [user, setUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getLocalUser = async () => {
            const localSavedUser = await LocalForage.getItem('user');
            setUser(localSavedUser);
        }
        getLocalUser();
    }, [])

    const loginUser = async (username) => {
        await LocalForage.setItem('user', username)
        setUser(username);
        navigate('/');
    }


    const logoutUser = async () => {
        await LocalForage.setItem('user', '');
        setUser('')
    }

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserContextProvider }
