

import { createContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useUser } from "./UserContext";
import { addServerTweet, getRealTimeTweets, getMoreTweetsFromDb } from "../lib/apiFirebaseDb"


const ERROR_TWEET_WITHOUT_TEXT = "Please write some text in order to Tweet";


const TweetsContext = createContext();

function TweetsContextProvider({ children }) {

    const { currentUser, usersMap } = useUser();

    const [isSaving, setIsSaving] = useState(false);
    const [appError, setAppError] = useState(null);
    const [tweets, setTweets] = useState([]);


   


    const isUserSet = () => {
        if (!currentUser) {      
            const userError = <>No user found. Please <Link to='/login'>Log in</Link></>;
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

            date: new Date().toISOString(),
            uid: currentUser.uid
        }
        const addedTweet = await addServerTweet(tweet, setAppError);//addServerTweet(tweet);
        if (addedTweet) {
            const newTweetArray = [...tweets];
            newTweetArray.unshift({ ...addedTweet, 
                userName: currentUser.userName, 
                photoURL: currentUser.photoURL,
            });
            setTweets(newTweetArray);
        }
        setIsSaving(false);
    }

    const  getMoreTweets = async () => {
         await getMoreTweetsFromDb(setTweets, setAppError)
    }


    useEffect(() => {
        let disconnect;
        if(!currentUser || !usersMap) return
            disconnect = getRealTimeTweets(setTweets, setAppError, usersMap); 
        return (
            () => { disconnect() }
        )
    }, [usersMap, currentUser]);


    useEffect(() => {
        currentUser && setAppError('');
    }, [currentUser])


    return (
        <TweetsContext.Provider
            value={{ tweets, addTweet,  appError, isSaving, getMoreTweets }}
        >
            {children}
        </TweetsContext.Provider>

    )
}

export { TweetsContext, TweetsContextProvider };
