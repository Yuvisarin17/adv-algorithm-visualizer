import React, { useState } from 'react';
import './styles/App.css';
import SortingVisualizer from './components/SortingVisualizer';
import PathfindingVisualizer from './components/PathfindingVisualizer';

function App() {
  const [showSorting, setShowSorting] = useState(true);
  
  return (
    <div className="App">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h1>Algorithm Visualizer</h1>
          <p>Interactive visualization of sorting and pathfinding algorithms</p>
        </div>

        {/* Navigation */}
        <div className="nav-tabs">
          <div 
            className={`nav-tab ${showSorting ? 'active' : ''}`}
            onClick={() => setShowSorting(true)}
          >
            Sorting Algorithms
          </div>
          <div 
            className={`nav-tab ${!showSorting ? 'active' : ''}`}
            onClick={() => setShowSorting(false)}
          >
            Pathfinding Algorithms
          </div>
        </div>

        {/* Main Content */}
        <div className="visualizer-card">
          <div className="visualizer-container">
            {showSorting ? <SortingVisualizer /> : <PathfindingVisualizer />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;