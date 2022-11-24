import './Main.css';
import CreateTweet from '../components/CreateTweet';
import Tweet from '../components/Tweet';
import { useEffect, useState } from 'react';



function Main() {

    
    const [isSaving, setIsSaving] = useState(false);
    const [serverError, setServerError] = useState('');
    const [tweets, setTweets] = useState([]);

    const url = 'https://micro-blogging-dot-full-stack-course-services.ew.r.appspot.com/tweet';
    const username = 'test-admin';
    //const date = new Date

    const addTweet = async (tweetTxt) => {
        setServerError();
        setIsSaving(true);
        const tweet = {
            content: tweetTxt,
            userName: username,
            date: new Date().toISOString(),
        }
        const response = await addServerTweet(tweet);
        if (response) {
        const newTweetArray = [...tweets];
        newTweetArray.unshift(tweet);
        setTweets(newTweetArray);
        }
        setIsSaving(false);
        
    }


    const addServerTweet = async (tweet) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tweet)
            });

            const data = await response.json();
            if (!response.ok)   {
                const error = (data && data.message) || response.status;
                console.log('error',error);
                throw error;
            }
            //console.log('Server Response', data)
            return data;

        } catch (error) {
            setServerError(error);
            return null;
        }

    }



    const getServerTweets = async () => {
        try {
            const response = await fetch(url);
            const isJson = response.headers.get('content-type')?.includes('application/json');
            if (!isJson) throw new Error('no json in response content-type');
            const data = await response.json();
            if (!response.ok) {
                const error = (data && data.message) || response.status;
                throw new Error(error)
            }
            data && setTweets(data.tweets);
        } catch (error) {
            console.log(error);
            setServerError(error);

        }
    }



    useEffect(() => {
        getServerTweets();
    }, []);


    return (
        <>
            <CreateTweet
                processSubmit={addTweet}
                isSaving={isSaving}
                serverError = {serverError}               
            />
            <div className='tweet-list'>

                {tweets.map(({ userName, content, date }, index) => {
                    return <Tweet
                        key={index}
                        userName={userName}
                        content={content}
                        date={date} />
                })}
            </div>
        </>


    )
}

export default Main;