import './Main.css';
import CreateTweet from '../components/CreateTweet';
import Tweet from '../components/Tweet';
import {  useContext } from 'react';
import {TweetsContext} from '../context/TweetsContext'



function Main({user}) {

    const {tweets} = useContext(TweetsContext);
 

    return (
        <section className='main-section'>
            <CreateTweet />
            <div className='tweet-list'>

                {tweets.map(({ userName, content, date, id }) => {
                    return <Tweet
                        key={id}
                        userName={userName}
                        content={content}
                        date={date} />
                })}
            </div>
        </section>


    )
}

export default Main;