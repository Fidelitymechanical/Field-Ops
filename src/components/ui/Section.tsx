import React from 'react';
import './Section.css';

interface SectionProps {
  number: string | number;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ number, children }) => {
    return (
        <div className='section'>
            <div className='section-number'>{number}</div>
            <div className='section-content'>{children}</div>
        </div>
    );
};

export default Section;