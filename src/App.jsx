import React, { useState } from 'react';
import './styles/App.css';
import SortingVisualizer from './components/SortingVisualizer';
import PathfindingVisualizer from './components/PathfindingVisualizer';

function App() {
  const [showSorting, setShowSorting] = useState(true);
  return (
    <div className="App">
      <h1>Algorithm Visualizer</h1>
      <div>
        <button onClick={() => setShowSorting(true)}>Show Sorting</button>
        <button onClick={() => setShowSorting(false)}>Show Pathfinding</button>
      </div>

      <div className = "visualizer-contiainer">
        {showSorting ? <SortingVisualizer /> : <PathfindingVisualizer />}
      </div>
    </div>
  );
}

export default App;
