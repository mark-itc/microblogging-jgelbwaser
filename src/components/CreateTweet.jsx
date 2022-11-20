import  './CreateTweet.css';
import {useState, useRef} from 'react';

function CreateTweet({processSubmit}) {

    const maxLengthTweet = 140;
    
    let isButtonDisabled = useRef(true);
    
    const[tweet, setTweet] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        processSubmit(tweet);
        setTweet('');
        isButtonDisabled.current = true;
        
    }



    const handleInputChange = (e) => {
        const tweetTxt = e.target.value;
        isButtonDisabled.current = !(tweetTxt.length > 0 &&  tweetTxt.length < maxLengthTweet)
        setTweet(tweetTxt);
        
    }

    return (
        <form className='tweet-form' onSubmit={handleSubmit}>
            <textarea
            className='tweet-input'
            placeholder='What you have in mind...'
            onInput={handleInputChange}
            value= {tweet}
            >

            </textarea >
            <div className='flex-space-between absolute-bottom'>
                {tweet.length >= maxLengthTweet &&
                <div className='tweet-length-warning'>
                The tweet can't contain more than {maxLengthTweet} chars.
                </div>}
                <button 
                className='tweet-btn' disabled={isButtonDisabled.current}  type='submit'>Tweet</button>
            </div>
        </form>
    )
}

export default CreateTweet;