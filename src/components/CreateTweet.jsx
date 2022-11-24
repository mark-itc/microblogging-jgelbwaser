import  './CreateTweet.css';
import {useState, useRef, useEffect} from 'react';

function CreateTweet({processSubmit, isSaving, serverError}) {

    const maxLengthTweet = 140;
    
    let isButtonDisabled = useRef(true);
    
    const[tweet, setTweet] = useState('');
    const[errorMsg, setErrorMsg] = useState(serverError);

    useEffect(()=>{setErrorMsg(serverError)},[serverError])



    const handleSubmit = (e) => {
        e.preventDefault();
        processSubmit(tweet);
        setTweet('');
        isButtonDisabled.current = true;
        
    }


    const handleInputChange = (e) => {
        const tweetTxt = e.target.value;
        setErrorMsg('');
        if(!isSaving) {
            
            const validTweetLength = (tweetTxt.length > 0 &&  tweetTxt.length < maxLengthTweet);
            isButtonDisabled.current = !validTweetLength;
            (validTweetLength || tweetTxt.length <= 0) ? setErrorMsg('') : setErrorMsg(`The tweet can't contain more than ${maxLengthTweet} chars.`);
        }     
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
                {errorMsg &&
                <div className='tweet-length warning'>
                {errorMsg}
                </div>}
                <button 
                className='tweet-btn' disabled={isButtonDisabled.current}  type='submit'>
                    {isSaving ? 'Saving..' : 'Tweet'}</button>
            </div>
        </form>
    )
}

export default CreateTweet;