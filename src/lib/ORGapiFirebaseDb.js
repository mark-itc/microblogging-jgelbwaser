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
        if (snapshot.empty) {
            MoreTweetDocsToDownload = false
        }
        lastTweetDoc = snapshot.docs[snapshot.docs.length - 1];
        const nextTweets = convertTweetSnapshotToArray(snapshot, dbUsersMap)
        updateStateTweets(prevTweets => {
            const mergedTweetArray = mergeTweetArrays( prevTweets, nextTweets);
            return mergedTweetArray
        })

    } catch (error) {
        console.log(error);
        updateStateError(error.message)
    }

}


// const mergeArraysOfArrays = (keyName = 'id', ...arrays) => {

//     //use largest array as starting point to avoid looping through it
//     const arraysToMerge = [...arrays]
//     const indexOfLongestArray = arraysToMerge.reduce((a, arr, idx) =>
//         arr.length > arrays[a].length ? idx : a, 0)
//     const mergedArray = [...arraysToMerge[indexOfLongestArray]];
//     const keysInMergedArray = arraysToMerge[indexOfLongestArray].map(item => item[keyName]);

//     arraysToMerge.forEach((arrayToMerge, indexArray) => {
//         if (indexArray === indexOfLongestArray) return
//         arrayToMerge.forEach(element => {
//             if (!keysInMergedArray.includes(element[keyName])) {
//                 keysInMergedArray.push(element[keyName]);
//                 indexArray < indexOfLongestArray ? mergedArray.shift(element) : mergedArray.push(element)
//             };
//         })
//     })
//     return [...mergedArray]
// }


const mergeTweetArrays = (...arraysToMerge) => {
    const mergedArray = [];
    const tweetIdsInMergedArray = [];
    [...arraysToMerge].forEach(arrayToMerge => {
        arrayToMerge.forEach(tweet => {
            if (!tweetIdsInMergedArray.includes(tweet.id)) {
                tweetIdsInMergedArray.push(tweet.id);
                mergedArray.push(tweet)
            };
        })
    })
    return [...mergedArray]
}

export const getRealTimeTweets = (updateStateTweets, updateStateError, usersMap) => {
    try {
        dbUsersMap = usersMap;
        const unsubscribe = onSnapshot(queryFireStore, snapshot => {
            lastTweetDocRealTime = snapshot.docs[snapshot.docs.length - 1];
            const dbTweets = convertTweetSnapshotToArray(snapshot, usersMap);
            updateStateTweets(prevTweets => {
                const mergedTweetArray = mergeTweetArrays( dbTweets, prevTweets);
                return mergedTweetArray
            })
        });
        return () => { unsubscribe() };

    } catch (error) {
        console.log(error);
        updateStateError(error.message)
    }
}