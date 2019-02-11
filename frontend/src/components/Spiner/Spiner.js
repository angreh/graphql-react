import React from 'react';

import './Spiner.css';

const spiner = () => (
    <div className="spinner">
        <div className="lds-ripple">
            <div></div>
            <div></div>
        </div>
    </div>
);

export default spiner;
