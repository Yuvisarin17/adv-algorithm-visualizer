import React, { useState, useEffect, useCallback } from 'react';
import GridCell from './GridCell';
import { dijkstra, aStar, bfs } from '../algorithms/pathfindingAlgorithms';
import '../styles/PathfindingVisualizer.css';

export default function PathfindingVisualizer() {
    const ROWS = 20;
    const COLS = 30;
    const [grid, setGrid] = useState([]);
    const [isMousePressed, setIsMousePressed] = useState(false);
    const [selectedTool, setSelectedTool] = useState('wall');
    const [startNode, setStartNode] = useState({ row: 10, col: 5 });
    const [endNode, setEndNode] = useState({ row: 10, col: 25 });
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('dijkstra');

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
    }

    function generateMaze() {
        const newGrid = grid.map(row =>
            row.map(node => ({
                ...node,
                cellType: node.cellType === 'start' || node.cellType === 'end' 
                    ? node.cellType 
                    : Math.random() < 0.3 ? 'wall' : 'empty',
                isVisited: false,
                isPath: false,
                distance: Infinity,
                previousNode: null
            }))
        );
        setGrid(newGrid);
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
            default:
                visitedNodesInOrder = dijkstra(grid, startNodeObj, endNodeObj);
        }
        
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNodeObj);
        
        await animateVisitedNodes(visitedNodesInOrder);
        await animateShortestPath(nodesInShortestPathOrder);
        
        setIsVisualizing(false);
    }

    function getNodesInShortestPathOrder(endNode) {
        const nodesInShortestPathOrder = [];
        let currentNode = endNode;
        while (currentNode !== null) {
            nodesInShortestPathOrder.unshift(currentNode);
            currentNode = currentNode.previousNode;
        }
        return nodesInShortestPathOrder;
    }

    function animateVisitedNodes(visitedNodesInOrder) {
        return new Promise(resolve => {
            for (let i = 0; i <= visitedNodesInOrder.length; i++) {
                if (i === visitedNodesInOrder.length) {
                    setTimeout(() => resolve(), 50 * i);
                    return;
                }
                setTimeout(() => {
                    const node = visitedNodesInOrder[i];
                    setGrid(prevGrid => {
                        const newGrid = prevGrid.map(row => [...row]);
                        newGrid[node.row][node.col] = { ...node, isVisited: true };
                        return newGrid;
                    });
                }, 20 * i);
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

    return (
        <div className="pathfinding-visualizer">
            <h2>Pathfinding Visualizer</h2>
            
            <div className="algorithm-selection">
                <h3>Choose Algorithm:</h3>
                <button
                    onClick={() => setSelectedAlgorithm('dijkstra')}
                    className={selectedAlgorithm === 'dijkstra' ? 'active' : ''}
                >
                    Dijkstra's Algorithm
                </button>
                <button
                    onClick={() => setSelectedAlgorithm('astar')}
                    className={selectedAlgorithm === 'astar' ? 'active' : ''}
                >
                    A* Search
                </button>
                <button
                    onClick={() => setSelectedAlgorithm('bfs')}
                    className={selectedAlgorithm === 'bfs' ? 'active' : ''}
                >
                    Breadth-First Search
                </button>
            </div>

            <div className="tool-selection">
                <h3>Drawing Tools:</h3>
                <button
                    onClick={() => setSelectedTool('start')}
                    className={selectedTool === 'start' ? 'active start-tool' : ''}
                >
                    Start Node
                </button>
                <button
                    onClick={() => setSelectedTool('end')}
                    className={selectedTool === 'end' ? 'active end-tool' : ''}
                >
                    End Node
                </button>
                <button
                    onClick={() => setSelectedTool('wall')}
                    className={selectedTool === 'wall' ? 'active wall-tool' : ''}
                >
                    Wall
                </button>
            </div>

            <div className="controls">
                <button onClick={visualizeAlgorithm} disabled={isVisualizing} className="visualize-btn">
                    {isVisualizing ? 'Visualizing...' : `Visualize ${selectedAlgorithm.toUpperCase()}`}
                </button>
                <button onClick={clearPath} className="clear-path-btn">Clear Path</button>
                <button onClick={clearGrid} className="clear-grid-btn">Clear Grid</button>
                <button onClick={generateMaze} className="maze-btn">Generate Maze</button>
            </div>

            <div className="legend">
                <div><span className="legend-box start"></span> Start</div>
                <div><span className="legend-box end"></span> End</div>
                <div><span className="legend-box wall"></span> Wall</div>
                <div><span className="legend-box visited"></span> Visited</div>
                <div><span className="legend-box path"></span> Shortest Path</div>
            </div>

            <div className="grid-container">
                {grid.map((row, rowIdx) => (
                    <div className="grid-row" key={rowIdx}>
                        {row.map((node, colIdx) => (
                            <GridCell
                                key={`${rowIdx}-${colIdx}`}
                                cellType={node.cellType}
                                isVisited={node.isVisited}
                                isPath={node.isPath}
                                distance={node.distance}
                                onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                                onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                                onMouseUp={handleMouseUp}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}