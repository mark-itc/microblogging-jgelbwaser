import './Tweet.css'
import React from 'react';

import { AVATAR_PIC_URL } from '../constants/constants.js'

const Tweet = React.forwardRef(({ content, userName, date, photoURL },ref) => {

    const contentWithoutExtraSpace = content.replace(/\s\s+/g, ' ');

    return (
        <div className='tweet-container'  ref={ref}>
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
})

export default Tweet;