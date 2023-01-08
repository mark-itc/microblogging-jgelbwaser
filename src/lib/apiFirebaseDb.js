import {
    collection, addDoc,
    onSnapshot, query, orderBy, serverTimestamp, limit, startAfter, getDocs
} from "firebase/firestore";
import { db } from "./init-firebase";
import { useState, useRef, useEffect } from 'react';

const ERROR_TWEET_ID_MISSING = "id missing in server response, can't confirmed  tweet was saved"
const TweetsLimitPerRequest = 10;
const tweetsColRef = collection(db, 'tweets');


//NOT in USU
// const queryFireStore = query(tweetsColRef, orderBy('timestamp', 'desc'), limit(TweetsLimitPerRequest));
// let dbUsersMap = {}
// let lastTweetDocRealTime = null;
// let lastTweetDoc = null
// let MoreTweetDocsToDownload = true;




export default function UseFirebaseTweets() {

    const [DBTweets, setDBTweets] = useState([]);
    const [DBError, setDBError] = useState(null);
    const [tweetQueryArgs, setTweetQueryArgs] = useState(
        [tweetsColRef, orderBy('timestamp', 'desc'), limit(TweetsLimitPerRequest)]
    )
    const lastTweet = useRef();
    let MoreTweetDocsToDownload = useRef(true);






    const getMoreTweetsFromDb = async () => {

         if (!MoreTweetDocsToDownload.current) return

        const queryMoreTweets = query(
            ...tweetQueryArgs,
            startAfter(lastTweet.current)
        );

        try {
            const snapshot = await getDocs(queryMoreTweets);
            if (snapshot.empty) {
                MoreTweetDocsToDownload.current = false
            }
            lastTweet.current = snapshot.docs[snapshot.docs.length - 1];
            const nextTweets = convertTweetSnapshotToArray(snapshot)
            setDBTweets(prevTweets => {
                const mergedTweetArray = mergeTweetArrays(prevTweets, nextTweets);
                return mergedTweetArray
            })

        } catch (error) {
            console.log(error);
            setDBError(error.message)
        }

    }


    const convertTweetSnapshotToArray = (snapshot) => {
        const TweetsDataArray = snapshot.docs.map(doc => {
            const tweetDataDB = { ...doc.data(), id: doc.id }
            return { ...tweetDataDB }
        })
        return TweetsDataArray
    }

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

    const addServerTweet = async (tweetData) => {
        try {
            const tweet = { ...tweetData, timestamp: serverTimestamp() }
            const response = await addDoc(tweetsColRef, tweet);
            if (!response.id) throw new Error(ERROR_TWEET_ID_MISSING);
            return { ...tweet, id: response.id };
        } catch (error) {
            console.log(error);
            setDBError(error.message);
            return
        }
    }



    useEffect(() => {
        try {
            const unsubscribe = onSnapshot(query(...tweetQueryArgs), snapshot => {
                if (!lastTweet.current) {
                    lastTweet.current = snapshot.docs[snapshot.docs.length - 1];
                }
                const newDBTweets = convertTweetSnapshotToArray(snapshot);
                setDBTweets(prevTweets => {
                    const mergedTweetArray = mergeTweetArrays(newDBTweets, prevTweets);
                    return mergedTweetArray
                })
                

            });
            return () => { unsubscribe() };

        } catch (error) {
            console.log(error);
            setDBError(error.message)
        }

    }, [tweetQueryArgs])



    return (
        { DBTweets, DBError, addServerTweet, getMoreTweetsFromDb }
    )
}



// const getRealTimeTweetsORG = () => {
//     try {
//         const unsubscribe = onSnapshot(query(tweetQueryArgs), snapshot => {
//             if (!lastTweet.current) {
//                 lastTweet.current = snapshot.docs[snapshot.docs.length - 1];
//             }
//             const newDBTweets = convertTweetSnapshotToArray(snapshot);
//             setDBTweets(prevTweets => {
//                 const mergedTweetArray = mergeTweetArrays(newDBTweets, prevTweets);
//                 return mergedTweetArray
//             })
//         });
//         return () => { unsubscribe() };

//     } catch (error) {
//         console.log(error);
//         setDBError(error.message)
//     }
// }
















// export const getRealTimeTweets = (updateStateTweets, updateStateError, usersMap) => {
//     try {
//         dbUsersMap = usersMap;
//         const unsubscribe = onSnapshot(queryFireStore, snapshot => {
//             lastTweetDocRealTime = snapshot.docs[snapshot.docs.length - 1];
//             const dbTweets = convertTweetSnapshotToArray(snapshot, usersMap);
//             updateStateTweets(prevTweets => {
//                 const mergedTweetArray = mergeTweetArrays(dbTweets, prevTweets);
//                 return mergedTweetArray
//             })
//         });
//         return () => { unsubscribe() };

//     } catch (error) {
//         console.log(error);
//         updateStateError(error.message)
//     }
// }
