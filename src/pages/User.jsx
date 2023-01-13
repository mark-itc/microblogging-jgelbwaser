

import './User.css';
import { useUser } from '../context/UserContext';
import { AVATAR_PIC_URL } from '../constants/constants.js';
import TweetList from '../components/TweetList';
//import {TweetsContext} from '../context/TweetsContext'


function User() {

    const { currentUser } = useUser();
   // const {searchInUsers} =useContext(TweetsContext)
 

    //photoURL
    //userName
    //email

 //   searchInUsers(currentUser.currentUser.uid)


    return (
        <section className="section">
            <div className='user-info'>
                <img className='profile-pic'
                    src={currentUser.photoURL || AVATAR_PIC_URL}
                    alt="profile-pic"
                />
                <h1>{currentUser.userName}</h1>
                <h3>{currentUser.email}</h3>
                <button className='submit-btn'>Edit</button>
            </div>
            <div className='hr-with-txt-line'>
                <span className="hr-with-txt-content">USER TWEETS</span>
            </div>
            <TweetList />
        </section>

    )
}

export default User