
import './App.css';
import Main from './pages/Main';
import User from './pages/User';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import LocalForage from 'localforage';
import { useEffect, useState } from 'react'

function App() {


  const navigate = useNavigate();
  const [user, setUser] = useState('');
  


  useEffect( ()=> {
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
    await LocalForage.setItem('user','');
    setUser('')
  }

  return (
    <div className="App">
      <nav className='nav-bar'>
        <NavLink className="nav-link" to='/'>Home</NavLink>
        <NavLink className="nav-link" to='/user'>Profile</NavLink>
        <div className='login-nav'>
        {
        user ? <>
         <span className='nav-greeting'>Hi {user} ! </span>
        <span className='logout-link nav-link' onClick={logoutUser}>Logout</span>
        </> :
        <NavLink className="nav-link" to='/user'>Log In</NavLink>
        }

        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path='/' element={<Main  user={user}/>}></Route>
          <Route path='/user'  element={<User user={user} processSubmit={loginUser}/>}></Route>
        </Routes>

      </div>
    </div>
  );
}

export default App;
