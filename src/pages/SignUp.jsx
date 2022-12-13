
import { useState, useEffect, useRef } from 'react';
import {Link} from 'react-router-dom';
import './User.css';
import { useUser } from '../context/UserContext';
import GoogleButton from 'react-google-button';


function SignUp() {

    const form = useRef();
    const { signUpUser, authError, loginUserWithGoogle  } = useUser();



    const [usernameInput, setUsernameInput] = useState('');
    const [pwdInput, setPwdInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(authError);



    const handleSubmit = (e) => {
        e.preventDefault();
        if (!usernameInput || !emailInput || !pwdInput) {
            setError("Please fill all input fields")
            return
        }
        setIsSaving(true);
        signUpUser(usernameInput, emailInput, pwdInput);
        authError && setError(authError);
        setIsSaving(false);

    }

    useEffect(()=> {setError(authError)},[authError])

    // useEffect(() => {
    //     console.log('Signup', currentUser )
    //     //currentUser && setUsernameInput(currentUser.email);
    // },
    //     [currentUser])

    useEffect(() => {setError(null)}, [usernameInput, pwdInput, emailInput])

    

    return (
        <section className="section">
            <h1>Sign Up</h1>
            <div className='desc'>Already have an account? 
             <Link className="nav-link" to='/login'> Log in here</Link>
                </div>
            <form ref={form}
                className='form'
                onSubmit={(e) => { handleSubmit(e) }}
            >
                {error &&
                    <div className='warning mb-1rem'>
                        {error}
                    </div>
                }
                <div className='form-group'>
                    <label
                        className='form-label'
                        htmlFor="username-input">Username
                    </label>
                    <input
                        value={usernameInput}
                        onChange={(e) => { setUsernameInput(e.target.value.trim()) }}
                        className='form-input'
                        id='username-input'
                        placeholder="Enter a username"
                        type='text'>
                    </input>
                </div>
                <div className='form-group'>
                    <label
                        className='form-label'
                        htmlFor="email-input">Email
                    </label>
                    <input
                        value={emailInput}
                        onChange={(e) => { setEmailInput(e.target.value.trim()) }}
                        className='form-input'
                        id='email-input'
                        placeholder="Enter an email"
                        type='email'>
                    </input>
                </div>
                <div className='form-group'>
                    <label
                        className='form-label'
                        htmlFor="password-input">Password
                    </label>
                    <input
                        value={pwdInput}
                        onChange={(e) => { setPwdInput(e.target.value.trim()) }}
                        className='form-input'
                        id='password-input'
                        placeholder="Enter a password"
                        type='password'>
                    </input>
                </div>

                <button
                    disabled={isSaving}
                    className='submit-btn form-button'
                    type='submit'
                >{isSaving ? 'Saving...' : 'Create an account'} </button>



            </form>
            <div className='hr-with-txt-line'>
                <span className="hr-with-txt-content">OR</span>
            </div>
            <GoogleButton onClick={loginUserWithGoogle} className='google-button' />

            
        </section>

        

    )
}

export default SignUp