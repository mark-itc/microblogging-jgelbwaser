import './TweetList.css';
import Tweet from './Tweet';
import { useContext, useRef, useCallback } from 'react';
import { TweetsContext } from '../context/TweetsContext';



export default function TweetList({ user }) {
    
    const { tweets, getMoreTweets, waitingForDb,searchResultsDesc } = useContext(TweetsContext);
    const observer = useRef();
    const lastTweetRef = useCallback(node => {
        if (waitingForDb) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(async entries => {
            if (entries[0].isIntersecting) {
                await getMoreTweets()

            }
        }, { threshold: 1 })
        if (node) observer.current.observe(node)
    }, [waitingForDb, getMoreTweets])


    return (
        <>
            <div className='search-results-desc'>
                {searchResultsDesc}
            </div>
            <div className='tweet-list'>

                {tweets.map(({ userName, content, date, id, photoURL, uid }, index) => {
                    const isLastTweet = index + 1 === tweets.length;
                    const refProp = isLastTweet ? { ref: lastTweetRef, 'test': "value" } : {};

                    return <Tweet
                        key={id}
                        userName={userName}
                        content={content}
                        date={date}
                        uid={uid}
                        photoURL={photoURL}
                        {...refProp}
                    />

                })}
            </div>
            < div className='loading-tweets'>
                {!tweets.length > 0 ?
                    (waitingForDb ? 'Loading tweets...' : 'No tweets found')
                    :
                    (waitingForDb ? 'Loading more tweets...' : 'No more tweets found')}
            </div>
        </>




    )
}

