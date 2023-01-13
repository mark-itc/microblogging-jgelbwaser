import './Main.css';
import CreateTweet from '../components/CreateTweet';
import { useContext } from 'react';
import { TweetsContext } from '../context/TweetsContext';
import FilterTweets from '../components/FilterTweets';
import TweetList from '../components/TweetList';


function Main({ user }) {


    const {  isFilterApplied } = useContext(TweetsContext);


    return (
        <section className={isFilterApplied ? 'main-section filter-applied' : 'main-section'}>
            <CreateTweet />
            <FilterTweets />
            <TweetList />
        </section>


    )
}

export default Main;