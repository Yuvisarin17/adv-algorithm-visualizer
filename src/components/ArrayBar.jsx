import React from 'react';
import '../styles/SortingVisualizer.css';

export default function ArrayBar({ height }) {
    return (
        <div className="array-bar" style={{height: `${height}px`}}>
        </div>
    );
}