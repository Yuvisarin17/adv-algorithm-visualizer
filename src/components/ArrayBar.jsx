import React from 'react';
import '../styles/SortingVisualizer.css';

export default function ArrayBar({ height, isHighlighted, isSorted, maxHeight = 300 }) {
    let className = 'array-bar';
    
    if (isSorted) {
        className += ' sorted';
    } else if (isHighlighted) {
        className += ' highlighted';
    }

    const barHeight = Math.max(height, 10);
    const heightPercentage = (barHeight / maxHeight) * 100;

    return (
        <div
            className={className}
            style={{ 
                height: `${heightPercentage}%`,
                minHeight: '10px'
            }}
        />
    );
}