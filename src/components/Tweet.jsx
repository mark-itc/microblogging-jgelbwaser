import './Tweet.css'

function Tweet({content, userName, date}) {

    const contentWithoutExtraSpace  = content.replace(/\s\s+/g, ' ');

    return (
        <div className='tweet-container'>
            <div className='tweet-header flex-space-between'>
                <span>{userName}</span>
                <span>{date}</span>
            </div>
            <div className='tweet-text'>
            {contentWithoutExtraSpace}
            </div>
        </div>
    )
}

export default Tweet;