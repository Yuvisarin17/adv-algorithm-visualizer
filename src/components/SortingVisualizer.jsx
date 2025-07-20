import React, { useState, useEffect } from 'react';
import ArrayBar from './ArrayBar';
import '../styles/SortingVisualizer.css';

export default function SortingVisualizer() {
    const [array, setArray] = useState([]);

    useEffect(() => {
        // Run once when component mounts -> set initial dummy array
        setArray([50, 100, 75, 30, 90]);
    }, []);

    return (
        <div className="sorting-container">
            {array.map((value, idx) => (
                <ArrayBar key={idx} height={value} />
            ))}
        </div>
    );
}