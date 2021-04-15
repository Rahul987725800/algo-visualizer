import { generateRandomArray } from '../../utils.js';
import bubbleSort from '../algos/bubbleSort';
import selectionSort from '../algos/selectionSort';
import mergeSort from '../algos/mergeSort';
import quickSort from '../algos/quickSort';
import insertionSort from '../algos/insertionSort';
import radixSort from '../algos/radixSort';
import shellSort from '../algos/shellSort';
export {
  bubbleSort,
  selectionSort,
  mergeSort,
  quickSort,
  insertionSort,
  radixSort,
  shellSort,
};

export const testAlgo = (algo) => {
  for (let n = 1; n <= 5; n++) {
    const arr = generateRandomArray(n);
    const dupArr = [...arr];
    arr.sort((a, b) => a - b);
    algo(dupArr);
    if (!arraysAreEqual(arr, dupArr)) return false;
  }
  return true;
};
const arraysAreEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
};
