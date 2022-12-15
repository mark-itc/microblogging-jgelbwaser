import {
    collection, addDoc,
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


const addUserData = (tweetDataDB, usersMap) => {
    if (!tweetDataDB.uid) return tweetDataDB
    const uid = tweetDataDB.uid;
    const {userName, photoURL}  = usersMap[uid];
    return {...tweetDataDB, userName, photoURL }
}

export const getRealTimeTweets = (updateStateTweets, updateStateError, usersMap) => {
    try { 
        const unsubscribe = onSnapshot(queryFireStore, snapshot => {
            const dbTweets = snapshot.docs.map(doc => {
                console.log('doc-data', doc.data())
                const tweetDataDB = { ...doc.data(), id: doc.id }
                const tweetWithUserData = addUserData(tweetDataDB, usersMap);
                console.log(tweetWithUserData)
                return {...tweetWithUserData}
            })
            updateStateTweets(dbTweets);
        });
        return () => { unsubscribe() };
    
    } catch (error) {
        console.log(error);
        updateStateError(error.message)    
    }
}