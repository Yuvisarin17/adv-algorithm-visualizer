import React, { useState, useEffect } from 'react';
import GridCell from './GridCell';
import '../styles/PathfindingVisualizer.css';

export default function PathfindingVisualizer() {
    const [grid, setGrid] = useState([]);

    useEffect(() => {
        // Create initial 20x20 grid filled with 0s
        const rows = 20;
        const cols = 20;
        const initialGrid = [];
        for (let row = 0; row < rows; row++) {
            const currentRow = [];
            for (let col = 0; col < cols; col++) {
                currentRow.push(0); // 0 = empty cell;
            }
            initialGrid.push(currentRow);
        }
        setGrid(initialGrid);
    }, []);

    return (
        <div className="grid-container">
            {grid.map((row, rowIdx) => (
                <div className="grid-row" key={rowIdx}>
                    {row.map((cell, colIdx) => (
                        <GridCell key={`${rowIdx}-${colIdx}`} />
                    ))}
                </div>
            ))}
        </div>
    );
}