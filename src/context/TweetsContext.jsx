

import { createContext, useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { UserContext } from "./UserContext";
// SWITCH SERVER DB: firebase: "../lib/apiFirebase"  OR FS Course server: "../lib/apiServerFsCourse" 
import { addServerTweet, getRealTimeTweets, getServerTweets } from "../lib/apiFirebase"


const INTERVAL_BETWEEN_TWEET_UPDATES = 1000;
const ERROR_TWEET_WITHOUT_TEXT = "Please write some text in order to Tweet";


const TweetsContext = createContext();

function TweetsContextProvider({ children }) {

    const [isSaving, setIsSaving] = useState(false);
    const [appError, setAppError] = useState(null);
    const [tweets, setTweets] = useState([]);


    const { user } = useContext(UserContext);


    const isUserSet = () => {
        if (!user) {
            const userError = <>No user found. Please <Link to='/user'>Log in</Link></>;
            setAppError(userError);
            return
        } else {
            return true
        }
    }

    const removeTxtExtraWhiteSpace = (txt) => {
        if (txt.trim().length === 0) {
            setAppError(ERROR_TWEET_WITHOUT_TEXT);
            return false
        }
        const txtCleanedWhiteSpace = txt.replace(/\s\s+/g, ' ').trim();
        return txtCleanedWhiteSpace
    }

    const addTweet = async (tweetTxt) => {
        setAppError(null);
        setIsSaving(true);
        if (!isUserSet()) return (setIsSaving(false));
        const tweetTxtWhiteSpaceClean = removeTxtExtraWhiteSpace(tweetTxt)
        if (!tweetTxtWhiteSpaceClean) return (setIsSaving(false));
        const tweet = {
            content: tweetTxtWhiteSpaceClean,
            userName: user,
            date: new Date().toISOString(),
        }
        const response = await addServerTweet(tweet, setAppError);//addServerTweet(tweet);
        if (response) {
            const newTweetArray = [...tweets];
            newTweetArray.unshift(response);
            setTweets(newTweetArray);
        }
        setIsSaving(false);
    }


    useEffect(() => {
        let disconnect;
        if (getRealTimeTweets) {
            disconnect = getRealTimeTweets(setTweets, setAppError);
        } else {
                const timer = setInterval( async ()=> {
                    getServerTweets(setTweets, setAppError);
                }, INTERVAL_BETWEEN_TWEET_UPDATES)
                disconnect = () => clearInterval(timer);
        }
        return (
            () => { disconnect() }
        )
    }, []);


    useEffect(() => {
        user && setAppError('');
    }, [user])


    return (
        <TweetsContext.Provider
            value={{ tweets, addTweet,  appError, isSaving }}
        >
            {children}
        </TweetsContext.Provider>

    )
}

export { TweetsContext, TweetsContextProvider };
