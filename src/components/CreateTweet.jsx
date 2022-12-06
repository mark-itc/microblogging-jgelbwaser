import './CreateTweet.css';
import { useState, useRef, useEffect, useContext } from 'react';
import { TweetsContext } from '../context/TweetsContext';



function CreateTweet() {

    const maxLengthTweet = 140;

    const { addTweet, isSaving, appError } = useContext(TweetsContext);

    let isButtonDisabled = useRef(true);

    const [tweetTxtInput, setTweetTxtInput] = useState('');
    const [errorMsg, setErrorMsg] = useState(appError);

    useEffect(() => { setErrorMsg(appError) }, [appError]);



    const handleSubmit = (e) => {
        e.preventDefault();
        addTweet(tweetTxtInput)
        setTweetTxtInput('');
        isButtonDisabled.current = true;
    }


    const handleInputChange = (e) => {
        const tweetTxt = e.target.value;
        setErrorMsg('');
        if (!isSaving) {
            const validTweetLength = (tweetTxt.length > 0 && tweetTxt.length < maxLengthTweet);
            isButtonDisabled.current = !validTweetLength;
            (validTweetLength || tweetTxt.length <= 0) ? setErrorMsg('') : setErrorMsg(`The tweet can't contain more than ${maxLengthTweet} chars.`);
        }
        setTweetTxtInput(tweetTxt);

    }
    //hi

    return (
        <form className='tweet-form' onSubmit={handleSubmit}>
            <textarea
                className='tweet-input form-input'
                placeholder='What you have in mind...'
                onInput={handleInputChange}
                value={tweetTxtInput}
            >

            </textarea >
            <div className='flex-space-between absolute-bottom'>
                {errorMsg &&
                    <div className='tweet-length warning'>
                        {errorMsg}
                    </div>}
                <button
                    className='submit-btn' disabled={isButtonDisabled.current} type='submit'>
                    {isSaving ? 'Saving...' : 'Tweet'}</button>
            </div>
        </form>
    )
}

export default CreateTweet;