import {
    collection, addDoc,
    onSnapshot, query, orderBy, serverTimestamp, limit, startAfter, getDocs, where
} from "firebase/firestore";
import { db } from "./init-firebase";
import { useState, useRef, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom'


const ERROR_TWEET_ID_MISSING = "id missing in server response, can't confirmed  tweet was saved"
const TWEETS_LIMIT_PER_REQUEST = 10;
const tweetsColRef = collection(db, 'tweets');
const initialQueryArgs = [tweetsColRef, orderBy('timestamp', 'desc'), limit(TWEETS_LIMIT_PER_REQUEST)];





export default function UseFirebaseTweets(currentUser, usersFilter) {

    const [DBTweets, setDBTweets] = useState([]);
    const [DBError, setDBError] = useState(null);
    const [tweetQueryArgs, setTweetQueryArgs] = useState(initialQueryArgs)
    const lastTweet = useRef();
    let MoreTweetDocsToDownload = useRef(true);
    const routeLocation = useLocation();
    const { profileUid } = useParams()

  


    const updateQueryArgs = ({ users, isPaginationOn }) => {
        const newQuery = [tweetsColRef, orderBy('timestamp', 'desc')];
        if (users) {
            const whereClause = where('uid', Array.isArray(users) ? 'in' : '==', users);
            newQuery.push(whereClause);
        }
        isPaginationOn && newQuery.push(limit(TWEETS_LIMIT_PER_REQUEST));
        console.log(newQuery);
        setTweetQueryArgs(newQuery);
    }

    const restoreQueryArgs = () => setTweetQueryArgs(initialQueryArgs)



    const getMoreTweetsFromDb = async () => {

        if (!MoreTweetDocsToDownload.current) return

        const usedQueryArgs = tweetQueryArgs;

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

            if (usedQueryArgs !== tweetQueryArgs) return
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
        if (!currentUser) return
        try {
            MoreTweetDocsToDownload.current = true
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
            return () => {
                lastTweet.current = null;
                setDBTweets([]);
                unsubscribe()
            };

        } catch (error) {
            console.log(error);
            setDBError(error.message)
        }

    }, [tweetQueryArgs, currentUser]);


    useEffect(() => {
        if (!currentUser) return
        const inUserPage = routeLocation.pathname.includes('/user')
        console.log(inUserPage);
        if (!inUserPage) {
            updateQueryArgs({ users: null, isPaginationOn: true })
            return
        }
        const profileUser = profileUid || currentUser.uid
        updateQueryArgs({ users: profileUser, isPaginationOn: true })
    }, [routeLocation, profileUid, currentUser]);


    return (
        { DBTweets, DBError, addServerTweet, getMoreTweetsFromDb, updateQueryArgs, restoreQueryArgs }
    )
}









