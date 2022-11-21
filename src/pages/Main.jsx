import './Main.css';
import CreateTweet from '../components/CreateTweet';
import Tweet from '../components/Tweet';
import { useEffect, useState } from 'react';
import localForage from 'localforage';


function Main() {

    const [tweets, setTweets] = useState([]);

    const username = 'javier';
    //const date = new Date

    const addTweet = (tweetTxt) => {
        const tweet = {
            content: tweetTxt,
            userNAme: username,
            date: new Date().toISOString(),
        }
        const newTweetArray = [...tweets];
        newTweetArray.unshift(tweet);
        setTweets(newTweetArray);
        localForage.setItem('tweets', newTweetArray);
    }

    const getOfflineTweets = async () => {
        const offlineTweets = await localForage.getItem('tweets');
        console.log('offlineTweets', offlineTweets);
        offlineTweets && setTweets(offlineTweets);
    }

    useEffect(() => {
        getOfflineTweets(); 
    }, []);


return (
    <>
        <CreateTweet processSubmit={addTweet} />
        <div className='tweet-list'>
            {tweets.map(({content, date}, index) => {
                return <Tweet
                    key={index}
                    userName={username}
                    content={content}
                    date={date} />
            })}
        </div>
    </>


)
}

export default Main;