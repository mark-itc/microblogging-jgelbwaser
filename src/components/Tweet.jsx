import './Tweet.css'
import React from 'react';
import {Link} from 'react-router-dom'

import { AVATAR_PIC_URL } from '../constants/constants.js'

const Tweet = React.forwardRef(({ content, userName, date, photoURL, uid },ref) => {

    const contentWithoutExtraSpace = content.replace(/\s\s+/g, ' ');

    return (
        <div className='tweet-container'  ref={ref}>
            <div className='tweet-header flex-space-between'>
                <Link to={`/user/${uid}`}>
                <div className='tweet-user-details'>
                    <img referrerPolicy="no-referrer" src={photoURL || AVATAR_PIC_URL} className='pic-user' alt=' user profile ' />
                    <span>{userName}</span>
                </div>
                </Link>
                <span>{new Date(date).toLocaleString()}</span>
            </div>
            <div className='tweet-text'>
                {contentWithoutExtraSpace}
            </div>
        </div>
    )
})

export default Tweet;