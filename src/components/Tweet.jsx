import './Tweet.css'
import { AVATAR_PIC_URL } from '../constants/constants.js'

function Tweet({ content, userName, date, photoURL }) {

    const contentWithoutExtraSpace = content.replace(/\s\s+/g, ' ');

    return (
        <div className='tweet-container'>
            <div className='tweet-header flex-space-between'>
                <div className='tweet-user-details'>
                    <img src={photoURL || AVATAR_PIC_URL} className='pic-user' alt=' user profile ' />
                    <span>{userName}</span>
                </div>
                <span>{date}</span>
            </div>
            <div className='tweet-text'>
                {contentWithoutExtraSpace}
            </div>
        </div>
    )
}

export default Tweet;