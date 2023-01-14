import './User.css';
import { useContext
 } from 'react';
import { useUser } from '../context/UserContext';
import { AVATAR_PIC_URL } from '../constants/constants.js';
import TweetList from '../components/TweetList';
import { TweetsContext } from '../context/TweetsContext';

function User() {
    const {  currentUser, usersMap } = useUser();
    const {profilePageUserId} = useContext(TweetsContext);
    const pageUser =  profilePageUserId? usersMap[profilePageUserId] : currentUser;

    return (
        <section className="section">
            <div className='user-info'>
                <img className='profile-pic'
                    src={pageUser.photoURL || AVATAR_PIC_URL}
                    alt="profile-pic"
                />
                <h1>{pageUser.userName}</h1>
                <h3>{pageUser.email}</h3>
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