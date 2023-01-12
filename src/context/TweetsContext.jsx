

import { createContext, useState, useEffect, useRef } from "react";
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

    const { currentUser, usersMap } = useUser();
    const { DBTweets, DBErrors, addServerTweet, getMoreTweetsFromDb, updateQueryArgs} = UseFirebaseTweets(currentUser)
 

    const [waitingForDb, setWaitingForDb] = useState(true);
    const [appError, setAppError] = useState(DBErrors);
    const [tweets, setTweets] = useState(DBTweets);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const usersFilter = useRef(null);
    const isPaginationOn = useRef(true) 


    const searchInUsers = (term) => {
        isPaginationOn.current =true
        //console.log(usersMap)
        const UidsFound = Object.keys(usersMap).filter((uid)=>{
            return usersMap[uid].userName.includes(term)
        })
        if(!UidsFound) return setTweets([])
        usersFilter.current = UidsFound
        updateQueryArgs({users: usersFilter.current, isPaginationOn: isPaginationOn.current})

    }
    
    const searchInTweets = (term) => {
        console.log('searchInTweets', term);
        setSearchTerm('');
        isPaginationOn.current =false
        updateQueryArgs({users: usersFilter.current, isPaginationOn: isPaginationOn.current})
        setSearchTerm(term);
    }

    // useEffect(()=>{
    //     updateQueryArgs({users: UsersFilterArray, isPaginationOn:isPaginationOn})
    // },[UsersFilterArray,isPaginationOn])

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

   

    const filterTweets = ({myTweets}) => {

        setSearchTerm('');
        if(myTweets) {
            setIsFilterApplied(true);
            usersFilter.current =currentUser.uid
        } else {
            usersFilter.current = null
            setIsFilterApplied(false);
        }
        setWaitingForDb(true);
        console.log('myTweets',myTweets)
        console.log('usersFilter',usersFilter)
        updateQueryArgs({users: usersFilter.current, isPaginationOn: isPaginationOn.current})
    
    }

  
    useEffect(()=>{
        setWaitingForDb(true);
    },[currentUser])

    useEffect(()=>{
        if(!usersMap) return
 
        const tweetArray = searchTerm ? 
            DBTweets.filter(tweet=> tweet.content.includes(searchTerm))
            :
            [...DBTweets] 

        const tweetsWithUserData = tweetArray.map(tweet => addUserData(tweet, usersMap));
        setTweets(tweetsWithUserData);
        setWaitingForDb(false);
        },[DBTweets,usersMap,searchTerm]);

        const value = {
            tweets, 
            isFilterApplied, 
            addTweet,  
            appError, 
            waitingForDb,
             setWaitingForDb, 
             getMoreTweets, 
             searchInUsers,
             searchInTweets,
             filterTweets }


    return (
        <TweetsContext.Provider  value={value}  >
            {children}
        </TweetsContext.Provider>

    )
}

export { TweetsContext, TweetsContextProvider };
