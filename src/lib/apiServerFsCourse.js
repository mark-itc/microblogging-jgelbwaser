
 const url = 'https://micro-blogging-dot-full-stack-course-services.ew.r.appspot.com/tweet';


export const addServerTweet = async (tweet, updateStateError) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tweet)
        });

        const data = await response.json();
        if (!response.ok) {
            const error = (data && data.message) || response.status;
            console.log('error', error);
            throw error;
        }
        return data;

    } catch (error) {
        updateStateError(error.message);
        return null;
    }
}


export const getServerTweets = async (updateStateTweets, updateStateError) => {

            try {
                const response = await fetch(url);
                const isJson = response.headers.get('content-type')?.includes('application/json');
                if (!isJson) throw new Error('no json in response content-type');
                const data = await response.json();
                if (!response.ok) {
                    const error = (data && data.message) || response.status;
                    throw new Error(error)
                }
                data && updateStateTweets(data.tweets);
            } catch (error) {
                console.log(error);
                updateStateError(error.message);
            }

}

export const getRealTimeTweets = null
