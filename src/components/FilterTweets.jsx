import React, { useState, useContext } from 'react';
import { TweetsContext } from '../context/TweetsContext';

import { Tabs, Tab } from '@mui/material';

export default function FilterTweets() {

    const [tabIndex, setTabIndex] = useState(0);
    const { filterTweets } = useContext(TweetsContext);

    const handleTabChange = (event, newValue) => {
        filterTweets({ myTweets: !tabIndex })
        setTabIndex(newValue);
    }


    return (
        <div className='tweet-filters-container'>

            <Tabs value={tabIndex} onChange={handleTabChange}>
                <Tab className="tweet-filter-option" label="All tweets" />
                <Tab className="tweet-filter-option" label="My tweets" />
            </Tabs>

        </div>
    )
}

