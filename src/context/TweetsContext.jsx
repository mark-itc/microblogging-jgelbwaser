import { createContext, useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { UserContext } from "./UserContext";
import {
    collection, getDocs, addDoc,
    onSnapshot, query, where, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "../lib/init-firebase";


const TweetsContext = createContext();

const tweetsColRef = collection(db, 'tweets');

const queryFireStore = query (tweetsColRef, orderBy('timestamp', 'desc'))


function TweetsContextProvider({ children }) {



    const [isSaving, setIsSaving] = useState(false);
    const [appError, setAppError] = useState(null);
    const [tweets, setTweets] = useState([]);

    const url = 'https://micro-blogging-dot-full-stack-course-services.ew.r.appspot.com/tweet';




    const addRemoteTweet = async (tweetData) => {
        try {
            const tweet = {...tweetData, timestamp:serverTimestamp()}
            const response = await addDoc(tweetsColRef, tweet);
            if (!response.id) throw new Error("id missing in server response, can't confirmed  tweet was saved");
            return { ...tweet, id: response.id };
        } catch (error) {
            setAppError(error);
            return
        }
    }

    const getRemoteTweets = async () => {
        try {
            const response = await getDocs(tweetsColRef);
            const dbTweets = response.docs.map(doc => {
                return { ...doc.data(), id: doc.id }
            })
            setTweets(dbTweets);
        } catch (error) {
            console.log(error.message)
        }
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
            if (!response.ok) {
                const error = (data && data.message) || response.status;
                console.log('error', error);
                throw error;
            }
            return data;

        } catch (error) {
            setAppError(error);
            return null;
        }
    }


    const getServerTweets = async () => {
        setInterval(
            async () => {
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
            }, 1000)

    }





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
            setAppError(`Please write some text in order to Tweet`);
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
        const response = await addRemoteTweet(tweet);//addServerTweet(tweet);
        if (response) {
            const newTweetArray = [...tweets];
            newTweetArray.unshift(response);
            setTweets(newTweetArray);
        }
        setIsSaving(false);
    }



    useEffect(() => {
        //getRemoteTweets();
        // getServerTweets();
        const unsubscribe = onSnapshot(queryFireStore, snapshot => {
            const dbTweets = snapshot.docs.map(doc => {
                return { ...doc.data(), id: doc.id }
            })
            console.log(dbTweets);
            setTweets(dbTweets);
        });
        return () => { unsubscribe() };

    }, []);

    useEffect(() => {
        user && setAppError('');
    }, [user])


    return (
        <TweetsContext.Provider
            value={{ tweets, addTweet, setAppError, appError, isSaving }}
        >
            {children}
        </TweetsContext.Provider>

    )
}

export { TweetsContext, TweetsContextProvider };
