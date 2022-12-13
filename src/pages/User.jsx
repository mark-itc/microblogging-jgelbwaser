
import { useState, useEffect } from 'react';
import './User.css';
import { useUser } from '../context/UserContext';


function User() {

    const { user, loginUser } =useUser;

    const [userInput, setUserInput] = useState(user);

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser(userInput);
    }

    useEffect(() => {
        setUserInput(user);
    },
        [user])


    return (
        <section className="section">
            <h1>Profile</h1>
            <form
                className='form'
                onSubmit={(e) => { handleSubmit(e) }}
            >
                <div className='form-group'>
                    <label
                        className='form-label'
                        htmlFor="username-input">User Name
                    </label>
                    <input
                        value={userInput}
                        onChange={(e) => { setUserInput(e.target.value.trim()) }}
                        className='form-input'
                        id='username-input'
                        placeholder="Enter a username"
                        type='text'></input>
                </div>
                <button
                    disabled={userInput ? false : true}
                    className='submit-btn form-button'
                    type='submit'
                >Log in</button>
            </form>
        </section>

    )
}

export default User