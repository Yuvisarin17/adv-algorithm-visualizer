import React from 'react';
import '../styles/SortingVisualizer.css';

export default function ArrayBar({ height, isHighlighted, isSorted }) {
    let className = 'array-bar';
    if (isSorted) {
        className += ' sorted';
    } else if (isHighlighted) {
        className += ' highlighted';
    }

    return (
        <div
            className={className}
            style={{ height: `${height}px` }}
        />
    );
}

