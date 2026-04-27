import React from 'react';
import './Section.css';

const Section = ({ number, children }) => {
    return (
        <div className='section'>
            <div className='section-number'>{number}</div>
            <div className='section-content'>{children}</div>
        </div>
    );
};

export default Section;