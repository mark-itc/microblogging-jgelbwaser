import {
    collection, getDocs, addDoc,
    onSnapshot, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./init-firebase";

const ERROR_TWEET_ID_MISSING = "id missing in server response, can't confirmed  tweet was saved"


const tweetsColRef = collection(db, 'tweets');
const queryFireStore = query(tweetsColRef, orderBy('timestamp', 'desc'))


export const addServerTweet = async (tweetData, updateStateError) => {
    try{
        const tweet = { ...tweetData, timestamp: serverTimestamp() }
        const response = await addDoc(tweetsColRef, tweet);
        if (!response.id) throw new Error(ERROR_TWEET_ID_MISSING);
        return { ...tweet, id: response.id };
    } catch (error) {
        console.log(error);
        updateStateError(error.message);
        return
    }
}

export const getServerTweets = async (updateStateTweets, updateStateError) => {
    console.log('get server called')
    try {
        const response = await getDocs(queryFireStore);
        const dbTweets = response.docs.map(doc => {
            return { ...doc.data(), id: doc.id }
        })
        console.log("dbTweets", dbTweets);
        updateStateTweets(dbTweets);
        
    } catch (error) {
        console.log(error);
        updateStateError(error.message)
    }
}


export const getRealTimeTweets = (updateStateTweets, updateStateError) => {
    try { 
        const unsubscribe = onSnapshot(queryFireStore, snapshot => {
            const dbTweets = snapshot.docs.map(doc => {
                return { ...doc.data(), id: doc.id }
            })
            updateStateTweets(dbTweets);
        });
        return () => { unsubscribe() };
    
    } catch (error) {
        console.log(error);
        updateStateError(error.message)    
    }
}