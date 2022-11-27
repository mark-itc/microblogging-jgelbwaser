import './Main.css';
import CreateTweet from '../components/CreateTweet';
import Tweet from '../components/Tweet';
import { useEffect, useState } from 'react';
//import LocalForage from 'localforage';
import {Link} from 'react-router-dom'



function Main({user}) {

    
    const [isSaving, setIsSaving] = useState(false);
    const [appError, setAppError] = useState(null);
    const [tweets, setTweets] = useState([]);
    //const [user, setUser] = useState('');

    const url = 'https://micro-blogging-dot-full-stack-course-services.ew.r.appspot.com/tweet';
    
   
    //const date = new Date

    // useEffect( ()=> {
    //     const getLocalUser = async () => {
    //         const localSavedUser = await(LocalForage.getItem('user'));
    //         setUser(localSavedUser)
    //     }
    //     getLocalUser();
    // }, [user]
    // )
    

    const addTweet = async (tweetTxt) => {
        
        if(!user) {
            const userError =  <>No user found. Please <Link to='/user'>Log in</Link></>;
            setAppError(userError);
            return
        } else {
            setAppError(null)
        }
        setIsSaving(true);
        const tweet = {
            content: tweetTxt,
            userName: user,
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
            setAppError(error);
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
            setAppError(error);

        }
    }



    useEffect(() => {
        getServerTweets();
    }, []);


    return (
        <section className='main-section'>
            <CreateTweet
                processSubmit={addTweet}
                isSaving={isSaving}
                appError = {appError}               
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
        </section>


    )
}

export default Main;