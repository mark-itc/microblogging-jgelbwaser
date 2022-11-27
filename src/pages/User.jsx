
import {useState} from 'react';
import './User.css';
import { useEffect } from 'react';

function User({user, processSubmit}) {



    const [userInput, setUserInput] = useState(user);

    const handleSubmit = (e)=> {
        e.preventDefault();
        processSubmit(userInput);
      }
      
      useEffect(()=>{
        setUserInput(user);
      },
      [user])


    return (
        <section className="profile-section">
            <h1>Profile</h1>
            <form 
            className='form-user'
            onSubmit={(e)=>{handleSubmit(e)}}
            >
                <label
                    className='label-username'
                    htmlFor="username-input">User Name
                </label>
                <input
                    value={userInput}
                    onChange={(e)=> {setUserInput(e.target.value)}}
                    className='form-input username-input'
                    id='username-input'
                    placeholder="Enter a username"
                    type='text'></input>
                <button 
                disabled= {userInput ? false : true }
                className='submit-btn user-form-button' 
                type='submit'
                >Log in</button>
            </form>
        </section>

    )
}

export default User