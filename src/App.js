
import './App.css';
import Main from './pages/Main';
import User from './pages/User';
import SignUp from './pages/SignUp'
import Login from './pages/Login';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useUser } from './context/UserContext';
import ProtectedRoute from './utilities/ProtectedRoute';
import { AVATAR_PIC_URL } from './constants/constants';



function App() {

  

  const { currentUser, logoutUser } = useUser();

  return (

    <div className="App">
      <nav className='nav-bar'>
        <NavLink className="nav-link" to='/'>Home</NavLink>
        <NavLink className="nav-link" to='/user'>User Profile</NavLink>
        <div className='login-nav'>
          {
            currentUser ? <>
              <img src={currentUser.photoURL || AVATAR_PIC_URL} className='pic-user' alt=' user profile '/>
              <span className='nav-greeting'>Hi {currentUser.userName}  </span>
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
          <Route path='/' element={<ProtectedRoute path='/' isLoggedIn={!!currentUser} Component={Main}/>} />
          <Route path='/user' element={<ProtectedRoute path='/user' isLoggedIn={!!currentUser} Component={User}/>}/>
          <Route path='/signup' element={<ProtectedRoute path='/signup' isLoggedIn={!!currentUser} Component={SignUp}/>}/>  
          <Route path='/login' element={<ProtectedRoute  path='/login' isLoggedIn={!!currentUser} Component={Login}/>}/>
          <Route path='*' element={<ProtectedRoute path='/' isLoggedIn={!!currentUser} Component={Main}/>} />
        </Routes>

      </div>
    </div>
  );
}

export default App;
