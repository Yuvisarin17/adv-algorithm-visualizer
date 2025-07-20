import React, { useState, useEffect } from 'react';
import ArrayBar from './ArrayBar';
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort } from '../algorithms/sortingAlgorithms';
import '../styles/SortingVisualizer.css';

export default function SortingVisualizer() {
    const [array, setArray] = useState([]);
    const [highlightedIndices, setHighlightedIndices] = useState([]);
    const [sortedIndices, setSortedIndices] = useState([]);
    const [selectedAlgo, setSelectedAlgo] = useState('bubble');
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSorting, setIsSorting] = useState(false);
    const [arraySize, setArraySize] = useState(30);
    const [speed, setSpeed] = useState(50);

    useEffect(() => {
        generateRandomArray();
    }, [arraySize]);

    function generateRandomArray() {
        const randomArray = Array.from({ length: arraySize }, () =>
            Math.floor(Math.random() * 280) + 20
        );
        setArray(randomArray);
        setSortedIndices([]);
        setHighlightedIndices([]);
        setSteps([]);
        setCurrentStep(0);
    }

    async function runSort() {
        let steps = [];
        if (selectedAlgo === 'bubble') steps = bubbleSort(array);
        if (selectedAlgo === 'selection') steps = selectionSort(array);
        if (selectedAlgo === 'insertion') steps = insertionSort(array);
        if (selectedAlgo === 'merge') steps = mergeSort(array);
        if (selectedAlgo === 'quick') steps = quickSort(array);

        setSteps(steps);
        setCurrentStep(0);
        setSortedIndices([]);
        setHighlightedIndices([]);
        setIsSorting(true);
    }

    function handleNextStep() {
        if (currentStep >= steps.length) {
            setHighlightedIndices([]);
            setIsSorting(false);
            return;
        }

        const step = steps[currentStep];
        setArray(prevArray => {
            const arrCopy = prevArray.slice();

            if (step.type === 'compare') {
                setHighlightedIndices(step.indices);
            }
            if (step.type === 'swap') {
                const [i, j] = step.indices;
                [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
            }
            if (step.type === 'overwrite') {
                arrCopy[step.index] = step.value;
            }
            if (step.type === 'markSorted') {
                setSortedIndices(prev => [...prev, step.index]);
            }

            return arrCopy;
        });

        setCurrentStep(prev => prev + 1);
    }

    async function handlePlayAll() {
        let currentArray = array.slice();
        
        for (let i = currentStep; i < steps.length; i++) {
            const step = steps[i];

            if (step.type === 'compare') {
                setHighlightedIndices(step.indices);
            }
            if (step.type === 'swap') {
                const [m, n] = step.indices;
                [currentArray[m], currentArray[n]] = [currentArray[n], currentArray[m]];
                setArray([...currentArray]);
            }
            if (step.type === 'overwrite') {
                currentArray[step.index] = step.value;
                setArray([...currentArray]);
            }
            if (step.type === 'markSorted') {
                setSortedIndices((prev) => [...prev, step.index]);
            }

            setCurrentStep((prev) => prev + 1);
            await sleep(101 - speed);
        }

        setHighlightedIndices([]);
        setIsSorting(false);
    }

    function handleReset() {
        generateRandomArray();
        setSteps([]);
        setCurrentStep(0);
        setSortedIndices([]);
        setHighlightedIndices([]);
        setIsSorting(false);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function formatAlgoName(algo) {
        const names = {
            'bubble': 'Bubble Sort',
            'selection': 'Selection Sort',
            'insertion': 'Insertion Sort',
            'merge': 'Merge Sort',
            'quick': 'Quick Sort'
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
        <div className="sorting-section">
            <h2 className="section-title">Sorting Visualizer</h2>
            
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
                        disabled={isSorting}
                    />
                </div>
                <div className="control-group">
                    <label>Size: {arraySize}</label>
                    <input 
                        type="range" 
                        className="slider" 
                        min="10" 
                        max="80" 
                        value={arraySize}
                        onChange={(e) => setArraySize(parseInt(e.target.value))}
                        disabled={isSorting}
                    />
                </div>
                <button 
                    className="btn secondary" 
                    onClick={generateRandomArray}
                    disabled={isSorting}
                >
                    Randomize
                </button>
                <button 
                    className="btn danger" 
                    onClick={handleReset}
                    disabled={isSorting}
                >
                    Reset
                </button>
            </div>
            
            <div className="algorithm-buttons">
                {['bubble', 'selection', 'insertion', 'merge', 'quick'].map(algo => (
                    <button
                        key={algo}
                        className={`algo-btn ${selectedAlgo === algo ? 'active' : ''}`}
                        onClick={() => setSelectedAlgo(algo)}
                        disabled={isSorting}
                    >
                        {formatAlgoName(algo)}
                    </button>
                ))}
            </div>

            <div className="action-buttons">
                <button 
                    className="btn"
                    onClick={runSort}
                    disabled={isSorting}
                >
                    Start Sorting
                </button>
                <button 
                    className="btn secondary"
                    onClick={handleNextStep}
                    disabled={!isSorting}
                >
                    Next Step
                </button>
                <button 
                    className="btn secondary"
                    onClick={handlePlayAll}
                    disabled={!isSorting}
                >
                    Play All
                </button>
            </div>

            <div className="legend">
                <div className="legend-item">
                    <div className="legend-box unsorted"></div>
                    <span>Unsorted</span>
                </div>
                <div className="legend-item">
                    <div className="legend-box comparing"></div>
                    <span>Comparing</span>
                </div>
                <div className="legend-item">
                    <div className="legend-box sorted"></div>
                    <span>Sorted</span>
                </div>
            </div>

            <div className="visualization-container">
                <div className="sorting-container">
                    {array.map((value, idx) => (
                        <ArrayBar
                            key={idx}
                            height={value}
                            isHighlighted={highlightedIndices.includes(idx)}
                            isSorted={sortedIndices.includes(idx)}
                            maxHeight={300}
                        />
                    ))}
                </div>
            </div>

            {/* Status Display */}
            {(isSorting || steps.length > 0) && (
                <div className="status-display">
                    <h3>{formatAlgoName(selectedAlgo)}</h3>
                    <p>Step {currentStep} of {steps.length}</p>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${steps.length > 0 ? (currentStep / steps.length) * 100 : 0}%` }}
                        ></div>
                    </div>
                    <p>Array Size: {array.length} | Speed: {getSpeedLabel()}</p>
                </div>
            )}
        </div>
    );
}