export function bubbleSort(array) {
    const steps = [];
    const arr = array.slice(); // make a copy

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            steps.push({ type: 'compare', indices: [j, j + 1] });
            if (arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j + 1], arr[j]];
                steps.push({ type: 'swap', indices: [j, j + 1] });
            }
        }
        steps.push({ type: 'markSorted', index: arr.length - i - 1 });
    }

    console.log(steps);
    return steps;
}

export function selectionSort(array) {
    const steps = [];
    const arr = array.slice();

    for (let i = 0; i < arr.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
            steps.push({ type: 'compare', indices: [minIdx, j] });
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            steps.push({ type: 'swap', indices: [i, minIdx] });
        }
        steps.push({ type: 'markSorted', index: i });
    }

    return steps;
}


export function insertionSort(array) {
    const steps = [];
    const arr = array.slice();

    for (let i = 1; i < arr.length; i++) {
        let j = i;
        while (j > 0 && arr[j] < arr[j - 1]) {
            steps.push({ type: 'compare', indices: [j, j - 1] });
            [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
            steps.push({ type: 'swap', indices: [j, j - 1] });
            j--;
        }
        steps.push({ type: 'markSorted', index: i });
    }
    // Optionally, mark index 0 as sorted at the end
    steps.push({ type: 'markSorted', index: 0 });

    return steps;
}

export function mergeSort(array) {
    const steps = [];
    const arr = array.slice();
    const aux = arr.slice();

    function mergeSortHelper(start, end) {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        mergeSortHelper(start, mid);
        mergeSortHelper(mid + 1, end);
        merge(start, mid, end);
    }

    function merge(start, mid, end) {
        let i = start;
        let j = mid + 1;
        let k = start;

        while (i <= mid && j <= end) {
            steps.push({ type: 'compare', indices: [i, j] });
            if (arr[i] <= arr[j]) {
                aux[k++] = arr[i++];
            } else {
                aux[k++] = arr[j++];
            }
        }
        while (i <= mid) aux[k++] = arr[i++];
        while (j <= end) aux[k++] = arr[j++];

        for (let m = start; m <= end; m++) {
            arr[m] = aux[m];
            steps.push({ type: 'overwrite', index: m, value: aux[m] }); // NEW!
        }

    }

    mergeSortHelper(0, arr.length - 1);

    for (let i = 0; i < arr.length; i++) {
        steps.push({ type: 'markSorted', index: i });
    }

    return steps;
}


export function quickSort(array) {
    const steps = [];
    const arr = array.slice();

    function quickSortHelper(start, end) {
        if (start >= end) return;
        const pivotIndex = partition(start, end);
        quickSortHelper(start, pivotIndex - 1);
        quickSortHelper(pivotIndex + 1, end);
    }

    function partition(start, end) {
        const pivot = arr[end];
        let i = start;

        for (let j = start; j < end; j++) {
            steps.push({ type: 'compare', indices: [j, end] });
            if (arr[j] < pivot) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                steps.push({ type: 'swap', indices: [i, j] });
                i++;
            }
        }
        [arr[i], arr[end]] = [arr[end], arr[i]];
        steps.push({ type: 'swap', indices: [i, end] });
        return i;
    }

    quickSortHelper(0, arr.length - 1);

    for (let i = 0; i < arr.length; i++) {
        steps.push({ type: 'markSorted', index: i });
    }

    return steps;
}
