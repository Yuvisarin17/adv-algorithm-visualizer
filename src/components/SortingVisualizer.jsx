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
    const [isSorting, setIsSorting] = useState(false); // optional: disable buttons while running



    useEffect(() => {
        generateRandomArray();
    }, []);

    function generateRandomArray() {
        const randomArray = Array.from({ length: 10 }, () =>
            Math.floor(Math.random() * 200) + 10
        );
        setArray(randomArray);
        setSortedIndices([]);
        setHighlightedIndices([]);
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
        const arrCopy = array.slice();

        if (step.type === 'compare') {
            setHighlightedIndices(step.indices);
        }
        if (step.type === 'swap') {
            const [i, j] = step.indices;
            [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
            setArray(arrCopy);
        }
        if (step.type === 'overwrite') {
            arrCopy[step.index] = step.value;
            setArray(arrCopy);
        }
        if (step.type === 'markSorted') {
            setSortedIndices(prev => [...prev, step.index]);
        }

        setCurrentStep(prev => prev + 1);
    }

    async function handlePlayAll() {
        for (let i = currentStep; i < steps.length; i++) {
            const step = steps[i];
            const arrCopy = array.slice();

            if (step.type === 'compare') {
                setHighlightedIndices(step.indices);
            }
            if (step.type === 'swap') {
                const [m, n] = step.indices;
                [arrCopy[m], arrCopy[n]] = [arrCopy[n], arrCopy[m]];
                setArray(arrCopy);
            }
            if (step.type === 'overwrite') {
                arrCopy[step.index] = step.value;
                setArray(arrCopy);
            }
            if (step.type === 'markSorted') {
                setSortedIndices((prev) => [...prev, step.index]);
            }

            setCurrentStep((prev) => prev + 1);
            await sleep(300);  // adjust speed here if you want faster/slower
        }

        setHighlightedIndices([]);
        setIsSorting(false);
    }


    function handleReset() {
        setArray(generateRandomArray());
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
        if (algo === 'bubble') return 'Bubble Sort';
        if (algo === 'selection') return 'Selection Sort';
        if (algo === 'insertion') return 'Insertion Sort';
        if (algo === 'merge') return 'Merge Sort';
        if (algo === 'quick') return 'Quick Sort';
        return '';
    }

    return (
        <div>
            <h2>Sorting Visualizer</h2>
            <div className="controls">
                <button
                    onClick={() => setSelectedAlgo('bubble')}
                    className={selectedAlgo === 'bubble' ? 'active' : ''}
                >
                    Bubble Sort
                </button>
                <button
                    onClick={() => setSelectedAlgo('selection')}
                    className={selectedAlgo === 'selection' ? 'active' : ''}
                >
                    Selection Sort
                </button>
                <button
                    onClick={() => setSelectedAlgo('insertion')}
                    className={selectedAlgo === 'insertion' ? 'active' : ''}
                >
                    Insertion Sort
                </button>
                <button
                    onClick={() => setSelectedAlgo('merge')}
                    className={selectedAlgo === 'merge' ? 'active' : ''}
                >
                    Merge Sort
                </button>
                <button
                    onClick={() => setSelectedAlgo('quick')}
                    className={selectedAlgo === 'quick' ? 'active' : ''}
                >
                    Quick Sort
                </button>
                <button onClick={generateRandomArray}>Randomize</button>
                <button onClick={runSort}>Start Sorting</button>
                <button onClick={handleNextStep} disabled={!isSorting}>Next Step</button>
                <button onClick={handlePlayAll} disabled={!isSorting}>Play All</button>
                <button onClick={handleReset}>Reset</button>
            </div>

            <div className="legend">
                <div><span className="legend-box normal"></span> Unsorted</div>
                <div><span className="legend-box highlighted"></span> Comparing</div>
                <div><span className="legend-box sorted"></span> Sorted</div>
            </div>

            <div className="sorting-container">
                {array.map((value, idx) => (
                    <ArrayBar
                        key={idx}
                        height={value}
                        isHighlighted={highlightedIndices.includes(idx)}
                        isSorted={sortedIndices.includes(idx)}
                    />
                ))}
            </div>
        </div>
    );
}