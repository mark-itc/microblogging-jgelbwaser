import {
    collection, addDoc,
    onSnapshot, query, orderBy, serverTimestamp, limit, startAfter, getDocs
} from "firebase/firestore";
import { db } from "./init-firebase";

const ERROR_TWEET_ID_MISSING = "id missing in server response, can't confirmed  tweet was saved"
const TweetsLimitPerRequest = 10;

const tweetsColRef = collection(db, 'tweets');
const queryFireStore = query(tweetsColRef, orderBy('timestamp', 'desc'), limit(TweetsLimitPerRequest));
let dbUsersMap = {}
let lastTweetDocRealTime = null;
let lastTweetDoc = null
let MoreTweetDocsToDownload = true;


export const addServerTweet = async (tweetData, updateStateError) => {
    try {
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


const convertTweetSnapshotToArray = (snapshot, usersMap) => {
    const TweetsDataArray = snapshot.docs.map(doc => {
        const tweetDataDB = { ...doc.data(), id: doc.id }
        const tweetWithUserData = addUserData(tweetDataDB, usersMap);
        return { ...tweetWithUserData }
    })
    return TweetsDataArray
}


const addUserData = (tweetDataDB, usersMap) => {
    if (!tweetDataDB.uid) return tweetDataDB
    const uid = tweetDataDB.uid;
    const { userName, photoURL } = usersMap[uid] ? usersMap[uid] : { userName: 'user not found', photoURL: null };
    return { ...tweetDataDB, userName, photoURL }
}

export const getMoreTweetsFromDb = async (updateStateTweets, updateStateError) => {
    if (!MoreTweetDocsToDownload) return
    
    const queryMoreTweets = query(
        tweetsColRef,
        orderBy('timestamp', 'desc'),
        startAfter(lastTweetDoc || lastTweetDocRealTime),
        limit(TweetsLimitPerRequest));

    try {     
        const snapshot = await getDocs(queryMoreTweets);
        if(snapshot.empty) {
            console.log("no more tweets")
            MoreTweetDocsToDownload = false
        }
        lastTweetDoc = snapshot.docs[snapshot.docs.length - 1];
        const nextTweets = convertTweetSnapshotToArray(snapshot, dbUsersMap)
        updateStateTweets(prevTweets => {
            const mergedTweetArray = [...new Set([...prevTweets, ...nextTweets])]
            return mergedTweetArray
        })

    } catch (error) {
        console.log(error);
        updateStateError(error.message)
    }

}

export const getRealTimeTweets = (updateStateTweets, updateStateError, usersMap) => {
    try {
        dbUsersMap = usersMap;
        const unsubscribe = onSnapshot(queryFireStore, snapshot => {
            lastTweetDocRealTime = snapshot.docs[snapshot.docs.length - 1];
            const dbTweets = convertTweetSnapshotToArray(snapshot, usersMap)
            updateStateTweets(prevTweets => {
                const mergedTweetArray = [...new Set([...dbTweets, ...prevTweets])]
                return mergedTweetArray
            })
        });
        return () => { unsubscribe() };

    } catch (error) {
        console.log(error);
        updateStateError(error.message)
    }
}