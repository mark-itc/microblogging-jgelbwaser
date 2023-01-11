import './Main.css';
import CreateTweet from '../components/CreateTweet';
import Tweet from '../components/Tweet';
import { useContext, useRef, useCallback } from 'react';
import { TweetsContext } from '../context/TweetsContext';
import FilterTweets from '../components/FilterTweets';


function Main({ user }) {


    const { tweets, getMoreTweets, waitingForDb, isFilterApplied } = useContext(TweetsContext);


    const observer = useRef();
    const lastTweetRef = useCallback(node => {
        if (waitingForDb) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver( async entries => {
            if (entries[0].isIntersecting) { 
                await getMoreTweets()
          
            }
        },{ threshold: 1 })
        if (node) observer.current.observe(node)
    }, [waitingForDb, getMoreTweets] )


    return (
        <section className={ isFilterApplied? 'main-section filter-applied' : 'main-section'}>
            <CreateTweet />
            <FilterTweets />
            <div className='tweet-list'>

                {tweets.map(({ userName, content, date, id, photoURL }, index) => {
                    const isLastTweet = index + 1 === tweets.length;
                    const refProp = isLastTweet ?  {ref: lastTweetRef, 'test': "value"} : {};

                        return <Tweet
                            key={id}
                            userName={userName}
                            content={content}
                            date={date}
                            photoURL={photoURL}
                         {...refProp}
                        />

                })}
            </div>
            < div className='loading-tweets'>
            {!tweets.length > 0 ? 
            (waitingForDb ? 'Loading tweets...': 'No tweets found')
            : 
            (waitingForDb ? 'Loading more tweets...': 'No more tweets found')}
            </div>


          

        </section>


    )
}

export default Main;