import './Main.css';
import CreateTweet from '../components/CreateTweet';
import Tweet from '../components/Tweet';
import { useContext, useRef, useCallback } from 'react';
import { TweetsContext } from '../context/TweetsContext'



function Main({ user }) {

   // const [waitingForDb, setIsLoading] = useState(false);

    const { tweets, getMoreTweets, waitingForDb } = useContext(TweetsContext);

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


   

    // const handleGetMoreTweets = async () => {
    //     setIsLoading(true);
    //     await getMoreTweets()
    //     setIsLoading(false);
    // }

    return (
        <section className='main-section'>
            <CreateTweet />
            <div className='tweet-list'>

                {tweets.map(({ userName, content, date, id, photoURL }, index) => {
                    const isLastTweet = index + 1 === tweets.length;
                    const refProp = isLastTweet ?  {ref: lastTweetRef, 'test': "value"} : {};

                        return <Tweet
                            style={{color: "red"}}
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
            {!tweets.length > 0 ? null : (
                waitingForDb ? 'Loading more tweets...': 'No more tweets found')}
            </div>
          

        </section>


    )
}

export default Main;