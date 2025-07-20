import React from 'react';
import '../styles/PathfindingVisualizer.css';

export default function GridCell({ 
    cellType, 
    onMouseDown, 
    onMouseEnter, 
    onMouseUp,
    isVisited,
    isPath,
    distance 
}) {
    let className = 'grid-cell';
    
    if (cellType === 'start') {
        className += ' start';
    } else if (cellType === 'end') {
        className += ' end';
    } else if (cellType === 'wall') {
        className += ' wall';
    } else if (isPath) {
        className += ' path';
    } else if (isVisited) {
        className += ' visited';
    }

    return (
        <div
            className={className}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseUp={onMouseUp}
        >
            {distance !== Infinity && distance > 0 && cellType === 'empty' && isVisited ? distance : ''}
        </div>
    );
}