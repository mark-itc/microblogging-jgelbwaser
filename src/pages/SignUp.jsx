
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './User.css';
import { useUser } from '../context/UserContext';
import GoogleButton from 'react-google-button';
import { AVATAR_PIC_URL } from '../constants/constants';


function SignUp() {

    const form = useRef();
    const { signUpUser, authError, loginUserWithGoogle } = useUser();



    const [usernameInput, setUsernameInput] = useState('');
    const [pwdInput, setPwdInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(authError);
    const [userUploadPic, setUserUploadPic] = useState();
    const [previewImageUrl, setPreviewImageUrl] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        if (!usernameInput || !emailInput || !pwdInput) {
            setError("Please fill all input fields")
            return
        }
        setIsSaving(true);
        signUpUser(usernameInput, emailInput, pwdInput, userUploadPic);
        authError && setError(authError);
        setIsSaving(false);

    }

    const handleSelectPic = (selectedFile) => {
        if (!selectedFile) return
        setUserUploadPic(selectedFile);
        const previewUrl = URL.createObjectURL(selectedFile);
        setPreviewImageUrl(previewUrl);
    }

    useEffect(() => { setError(authError) }, [authError])


    useEffect(() => { setError(null) }, [usernameInput, pwdInput, emailInput])



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
                

                <div className='form-group profile-pic-group'>
                    <label className='form-label profile-pic-label'>
                        
                        <img className='profile-pic' 
                        src={previewImageUrl ? previewImageUrl : AVATAR_PIC_URL } alt="profile-pic" />
                        <input
                            type="file" accept="/image/*" style={{display: 'none'}}
                            onChange={(e) => { handleSelectPic(e.target.files[0]) }}
                        />
                        + Add Profile Picture
                    </label>
                </div>

                <div className='form-group'>
                    <label className='form-label'>
                        Username
                        <input
                            value={usernameInput}
                            onChange={(e) => { setUsernameInput(e.target.value.trim()) }}
                            type='text' className='form-input' placeholder="Enter a username"
                        />
                    </label>
                </div>

                <div className='form-group'>
                    <label className='form-label'>
                        Email
                        <input
                            value={emailInput}
                            onChange={(e) => { setEmailInput(e.target.value.trim()) }}
                            type='email' className='form-input' placeholder="Enter an email"
                        />
                    </label>
                </div>

                <div className='form-group'>
                    <label className='form-label'>
                        Password
                        <input
                            value={pwdInput}
                            onChange={(e) => { setPwdInput(e.target.value.trim()) }}
                            type='password' className='form-input' placeholder="Enter a password"
                        />
                    </label>
                </div>

                {error &&
                    <div className='warning mb-1rem'>
                        {error}
                    </div>
                }


                <button type='submit' disabled={isSaving}  className='submit-btn form-button' >               
                {isSaving ? 'Saving...' : 'Create an account'} 
                </button>

            </form>
            <div className='hr-with-txt-line'>
                <span className="hr-with-txt-content">OR</span>
            </div>
            <GoogleButton onClick={loginUserWithGoogle} className='google-button' />

        </section>
    )
}

export default SignUp