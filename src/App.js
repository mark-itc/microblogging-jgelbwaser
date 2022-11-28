
import './App.css';
import Main from './pages/Main';
import User from './pages/User';
import { Routes, Route, NavLink } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import { useContext } from 'react';



function App() {


  const { user, logoutUser } = useContext(UserContext);

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
          <Route path='/' element={<Main user={user} />}></Route>
          <Route path='/user' element={<User user={user} />}></Route>
        </Routes>

      </div>
    </div>
  );
}

export default App;
