import './Tweet.css'

function Tweet({content, userName, date}) {



    return (
        <div className='tweet-container'>
            <div className='tweet-header flex-space-between'>
                <span>{userName}</span>
                <span>{date}</span>
            </div>
            <div className='tweet-text'>
            {content}
            </div>
        </div>
    )
}

export default Tweet;