
import './App.css';
import Main from './pages/Main';
import User from './pages/User';
import SignUp from './pages/SignUp'
import Login from './pages/Login';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useUser } from './context/UserContext';



function App() {


  const { currentUser, logoutUser } = useUser();
  

  return (

    <div className="App">
      <nav className='nav-bar'>
        <NavLink className="nav-link" to='/'>Home</NavLink>
        <NavLink className="nav-link" to='/user'>Profile</NavLink>
        <div className='login-nav'>
          {
            currentUser ? <>
              <span className='nav-greeting'>Hi {currentUser.userName} ! </span>
              <span className='logout-link nav-link' onClick={logoutUser}>Logout</span>
            </> :
            <>
              <NavLink className="nav-link" to='/login'>Log In</NavLink> 
                
              <NavLink className="nav-link last-link" to='/signup'>Sign up</NavLink>
            </>
          }

        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path='/' element={<Main />}></Route>
          <Route path='/user' element={<User  />}></Route>
          <Route path='/signup' element={<SignUp  />}></Route>
          <Route path='/login' element={<Login />}></Route>
        </Routes>

      </div>
    </div>
  );
}

export default App;
