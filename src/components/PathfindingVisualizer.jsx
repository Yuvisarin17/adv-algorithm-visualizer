import React, { useState, useEffect, useCallback } from 'react';
import GridCell from './GridCell';
import { dijkstra, aStar, bfs, dfs, getNodesInShortestPathOrder } from '../algorithms/pathfindingAlgorithms';
import '../styles/PathfindingVisualizer.css';

export default function PathfindingVisualizer() {
    const ROWS = 20;
    const COLS = 35;
    const [grid, setGrid] = useState([]);
    const [isMousePressed, setIsMousePressed] = useState(false);
    const [selectedTool, setSelectedTool] = useState('wall');
    const [startNode, setStartNode] = useState({ row: 10, col: 8 });
    const [endNode, setEndNode] = useState({ row: 10, col: 27 });
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('dijkstra');
    const [speed, setSpeed] = useState(50);
    const [visitedCount, setVisitedCount] = useState(0);
    const [pathLength, setPathLength] = useState(0);

    useEffect(() => {
        const initialGrid = createGrid();
        setGrid(initialGrid);
    }, []);

    function createGrid() {
        const grid = [];
        for (let row = 0; row < ROWS; row++) {
            const currentRow = [];
            for (let col = 0; col < COLS; col++) {
                const node = {
                    col,
                    row,
                    cellType: getInitialCellType(row, col),
                    distance: Infinity,
                    isVisited: false,
                    previousNode: null,
                    heuristic: 0,
                    fScore: Infinity,
                    isPath: false
                };
                currentRow.push(node);
            }
            grid.push(currentRow);
        }
        return grid;
    }

    function getInitialCellType(row, col) {
        if (row === startNode.row && col === startNode.col) return 'start';
        if (row === endNode.row && col === endNode.col) return 'end';
        return 'empty';
    }

    function clearGrid() {
        const newGrid = createGrid();
        setGrid(newGrid);
        setVisitedCount(0);
        setPathLength(0);
    }

    function clearPath() {
        const newGrid = grid.map(row =>
            row.map(node => ({
                ...node,
                isVisited: false,
                isPath: false,
                distance: Infinity,
                previousNode: null,
                heuristic: 0,
                fScore: Infinity
            }))
        );
        setGrid(newGrid);
        setVisitedCount(0);
        setPathLength(0);
    }

    function generateMaze() {
        const newGrid = grid.map(row =>
            row.map(node => ({
                ...node,
                cellType: node.cellType === 'start' || node.cellType === 'end' 
                    ? node.cellType 
                    : Math.random() < 0.25 ? 'wall' : 'empty',
                isVisited: false,
                isPath: false,
                distance: Infinity,
                previousNode: null
            }))
        );
        setGrid(newGrid);
        setVisitedCount(0);
        setPathLength(0);
    }

    const handleMouseDown = useCallback((row, col) => {
        if (isVisualizing) return;
        setIsMousePressed(true);
        const newGrid = getNewGridWithToggledNode(grid, row, col, selectedTool);
        setGrid(newGrid);
    }, [grid, selectedTool, isVisualizing]);

    const handleMouseEnter = useCallback((row, col) => {
        if (!isMousePressed || isVisualizing) return;
        const newGrid = getNewGridWithToggledNode(grid, row, col, selectedTool);
        setGrid(newGrid);
    }, [grid, selectedTool, isMousePressed, isVisualizing]);

    const handleMouseUp = useCallback(() => {
        setIsMousePressed(false);
    }, []);

    function getNewGridWithToggledNode(grid, row, col, tool) {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        
        if (tool === 'start') {
            newGrid.forEach(row => row.forEach(node => {
                if (node.cellType === 'start') node.cellType = 'empty';
            }));
            setStartNode({ row, col });
        } else if (tool === 'end') {
            newGrid.forEach(row => row.forEach(node => {
                if (node.cellType === 'end') node.cellType = 'empty';
            }));
            setEndNode({ row, col });
        }
        
        const newNode = {
            ...node,
            cellType: tool === 'wall' && node.cellType === 'wall' ? 'empty' : tool,
        };
        
        newGrid[row][col] = newNode;
        return newGrid;
    }

    async function visualizeAlgorithm() {
        if (isVisualizing) return;
        
        setIsVisualizing(true);
        clearPath();
        
        const startNodeObj = grid[startNode.row][startNode.col];
        const endNodeObj = grid[endNode.row][endNode.col];
        
        let visitedNodesInOrder;
        
        switch (selectedAlgorithm) {
            case 'dijkstra':
                visitedNodesInOrder = dijkstra(grid, startNodeObj, endNodeObj);
                break;
            case 'astar':
                visitedNodesInOrder = aStar(grid, startNodeObj, endNodeObj);
                break;
            case 'bfs':
                visitedNodesInOrder = bfs(grid, startNodeObj, endNodeObj);
                break;
            case 'dfs':
                visitedNodesInOrder = dfs(grid, startNodeObj, endNodeObj);
                break;
            default:
                visitedNodesInOrder = dijkstra(grid, startNodeObj, endNodeObj);
        }
        
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNodeObj);
        
        await animateVisitedNodes(visitedNodesInOrder);
        await animateShortestPath(nodesInShortestPathOrder);
        
        setVisitedCount(visitedNodesInOrder.length);
        setPathLength(nodesInShortestPathOrder.length);
        setIsVisualizing(false);
    }

    function animateVisitedNodes(visitedNodesInOrder) {
        return new Promise(resolve => {
            for (let i = 0; i <= visitedNodesInOrder.length; i++) {
                if (i === visitedNodesInOrder.length) {
                    setTimeout(() => resolve(), (101 - speed) * i);
                    return;
                }
                setTimeout(() => {
                    const node = visitedNodesInOrder[i];
                    setGrid(prevGrid => {
                        const newGrid = prevGrid.map(row => [...row]);
                        newGrid[node.row][node.col] = { ...node, isVisited: true };
                        return newGrid;
                    });
                }, (101 - speed) * i);
            }
        });
    }

    function animateShortestPath(nodesInShortestPathOrder) {
        return new Promise(resolve => {
            for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
                setTimeout(() => {
                    const node = nodesInShortestPathOrder[i];
                    setGrid(prevGrid => {
                        const newGrid = prevGrid.map(row => [...row]);
                        newGrid[node.row][node.col] = { ...newGrid[node.row][node.col], isPath: true };
                        return newGrid;
                    });
                    if (i === nodesInShortestPathOrder.length - 1) {
                        resolve();
                    }
                }, 50 * i);
            }
        });
    }

    function formatAlgoName(algo) {
        const names = {
            'dijkstra': "Dijkstra's Algorithm",
            'astar': 'A* Search',
            'bfs': 'Breadth-First Search',
            'dfs': 'Depth-First Search'
        };
        return names[algo] || '';
    }

    const getSpeedLabel = () => {
        if (speed > 80) return 'Very Fast';
        if (speed > 60) return 'Fast';
        if (speed > 40) return 'Medium';
        if (speed > 20) return 'Slow';
        return 'Very Slow';
    };

    return (
        <div className="pathfinding-section">
            <h2 className="section-title">Pathfinding Visualizer</h2>
            
            {/* Global Controls */}
            <div className="global-controls">
                <div className="control-group">
                    <label>Speed: {getSpeedLabel()}</label>
                    <input 
                        type="range" 
                        className="slider" 
                        min="1" 
                        max="100" 
                        value={speed}
                        onChange={(e) => setSpeed(parseInt(e.target.value))}
                        disabled={isVisualizing}
                    />
                </div>
                <button 
                    className="btn secondary" 
                    onClick={generateMaze}
                    disabled={isVisualizing}
                >
                    Generate Maze
                </button>
                <button 
                    className="btn danger" 
                    onClick={clearGrid}
                    disabled={isVisualizing}
                >
                    Clear Grid
                </button>
            </div>
            
            {/* Algorithm Selection */}
            <div className="algorithm-buttons">
                {['dijkstra', 'astar', 'bfs', 'dfs'].map(algo => (
                    <button
                        key={algo}
                        className={`algo-btn ${selectedAlgorithm === algo ? 'active' : ''}`}
                        onClick={() => setSelectedAlgorithm(algo)}
                        disabled={isVisualizing}
                    >
                        {formatAlgoName(algo)}
                    </button>
                ))}
            </div>

            {/* Tool Selection */}
            <div className="tool-selection">
                <h3>Drawing Tools:</h3>
                <div className="tool-buttons">
                    {[
                        { key: 'start', label: 'Start Node', color: '#4CAF50' },
                        { key: 'end', label: 'End Node', color: '#F44336' },
                        { key: 'wall', label: 'Wall', color: '#333333' }
                    ].map(tool => (
                        <button
                            key={tool.key}
                            className={`tool-btn ${selectedTool === tool.key ? 'active' : ''}`}
                            onClick={() => setSelectedTool(tool.key)}
                            disabled={isVisualizing}
                            style={{
                                backgroundColor: selectedTool === tool.key ? tool.color : '#f8f9fa',
                                color: selectedTool === tool.key ? 'white' : '#495057'
                            }}
                        >
                            {tool.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
                <button 
                    className="btn"
                    onClick={visualizeAlgorithm}
                    disabled={isVisualizing}
                >
                    {isVisualizing ? 'Visualizing...' : `Visualize ${formatAlgoName(selectedAlgorithm)}`}
                </button>
                <button 
                    className="btn secondary"
                    onClick={clearPath}
                    disabled={isVisualizing}
                >
                    Clear Path
                </button>
            </div>

            {/* Legend */}
            <div className="legend">
                <div className="legend-item">
                    <div className="legend-box start"></div>
                    <span>Start</span>
                </div>
                <div className="legend-item">
                    <div className="legend-box end"></div>
                    <span>End</span>
                </div>
                <div className="legend-item">
                    <div className="legend-box wall"></div>
                    <span>Wall</span>
                </div>
                <div className="legend-item">
                    <div className="legend-box visited"></div>
                    <span>Visited</span>
                </div>
                <div className="legend-item">
                    <div className="legend-box path"></div>
                    <span>Shortest Path</span>
                </div>
            </div>

            {/* Grid Visualization */}
            <div className="visualization-container">
                <div className="grid-container">
                    {grid.map((row, rowIdx) => (
                        <div key={rowIdx} className="grid-row">
                            {row.map((node, colIdx) => (
                                <GridCell
                                    key={`${rowIdx}-${colIdx}`}
                                    cellType={node.cellType}
                                    isVisited={node.isVisited}
                                    isPath={node.isPath}
                                    onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                                    onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                                    onMouseUp={handleMouseUp}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Status Display */}
            {(isVisualizing || visitedCount > 0) && (
                <div className="status-display">
                    <h3>{formatAlgoName(selectedAlgorithm)}</h3>
                    <p>Nodes Visited: {visitedCount} | Path Length: {pathLength}</p>
                    <p>Speed: {getSpeedLabel()}</p>
                    {pathLength === 0 && visitedCount > 0 && (
                        <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>No path found!</p>
                    )}
                </div>
            )}

            {/* Instructions */}
            <div className="instructions">
                <p>Click and drag to draw walls. Select different tools to place start/end nodes.</p>
                <p>Try different algorithms to see how they explore the grid!</p>
            </div>
        </div>
    );
}