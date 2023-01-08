

import { createContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useUser } from "./UserContext";
import UseFirebaseTweets from "../lib/apiFirebaseDb";
//import { addServerTweet, getRealTimeTweets, getMoreTweetsFromDb } from "../lib/apiFirebaseDb"


const ERROR_TWEET_WITHOUT_TEXT = "Please write some text in order to Tweet";

const addUserData = (tweetDataDB, usersMap) => {
    if (!tweetDataDB.uid) return tweetDataDB
    const uid = tweetDataDB.uid;
    const { userName, photoURL } = usersMap[uid] ? usersMap[uid] : { userName: 'user not found', photoURL: null };
    return { ...tweetDataDB, userName, photoURL }
}


const TweetsContext = createContext();

function TweetsContextProvider({ children }) {

    const { DBTweets, DBErrors, addServerTweet, getMoreTweetsFromDb} = UseFirebaseTweets()
    const { currentUser, usersMap } = useUser();

    const [waitingForDb, setWaitingForDb] = useState(false);
    const [appError, setAppError] = useState(DBErrors);
    const [tweets, setTweets] = useState(DBTweets);

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
        setWaitingForDb(true);
        if (!isUserSet()) return (setWaitingForDb(false));
        const tweetTxtWhiteSpaceClean = removeTxtExtraWhiteSpace(tweetTxt)
        if (!tweetTxtWhiteSpaceClean) return (setWaitingForDb(false));
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
        setWaitingForDb(false);
    }

    const  getMoreTweets = async () => {
        setWaitingForDb(true);
        await getMoreTweetsFromDb()
        setWaitingForDb(false);

    }




    useEffect(()=>{
        if(!usersMap) return
        const tweetsWithUserData = DBTweets.map(tweet => addUserData(tweet, usersMap));
        setTweets(tweetsWithUserData)
        },[DBTweets,usersMap])



    // useEffect(() => {
    //     let disconnect;
    //     if(!currentUser || !usersMap) return
    //         disconnect = getRealTimeTweets(setTweets, setAppError, usersMap); 
    //     return (
    //         () => { disconnect() }
    //     )
    // }, [usersMap, currentUser]);


    useEffect(() => {
        currentUser && setAppError('');
    }, [currentUser])


   

    return (
        <TweetsContext.Provider
            value={{ tweets, addTweet,  appError, waitingForDb, getMoreTweets }}
        >
            {children}
        </TweetsContext.Provider>

    )
}

export { TweetsContext, TweetsContextProvider };
