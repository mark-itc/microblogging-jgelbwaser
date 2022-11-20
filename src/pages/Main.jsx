import './Main.css';
import CreateTweet from '../components/CreateTweet';
import Tweet from '../components/Tweet';
import { useState } from 'react';



function Main() {

    const [tweets, setTweets] = useState([]);

    const username = 'javier';
    //const date = new Date

    const addTweet = (tweetTxt) => {
        const tweet ={
            content: tweetTxt,
            userNAme: username,
            date: new Date().toISOString(),
        }
        console.log(tweet);
        const newTweetArray = [...tweets];
       newTweetArray.unshift(tweet);
       setTweets(newTweetArray);
    }


    return (
        <>
            <CreateTweet processSubmit={addTweet} />
            <div className='tweet-list'>
                {tweets.map(({content, date}, index)=>{
                     return <Tweet 
                        key = {index}
                        userName = {username}
                        content = {content}
                        date = {date} />
                })}
            </div>
        </>


    )
}

export default Main;