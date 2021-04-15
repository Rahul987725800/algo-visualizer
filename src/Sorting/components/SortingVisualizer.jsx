import React, { useState, useEffect } from 'react';
import { generateRandomArray } from '../../utils.js';
import styles from './SortingVisualizer.module.css';
import {
  bubbleSort,
  testAlgo,
  selectionSort,
  mergeSort,
  quickSort,
  insertionSort,
  radixSort,
  shellSort,
} from './algorithms';

const HEIGHT_RANGE = {
  min: 5,
  max: Math.floor((window.innerHeight * 62) / 100),
};
const randomArray = (n) => {
  return generateRandomArray(n, HEIGHT_RANGE.min, HEIGHT_RANGE.max);
};
const BARS_TOTAL_WIDTH = (window.innerWidth * 70) / 100;
const MIN_WIDTH_BAR = 5;
const MARGIN_WIDTH_BAR = 1;
const MAX_BARS = Math.floor(
  BARS_TOTAL_WIDTH / (MIN_WIDTH_BAR + MARGIN_WIDTH_BAR),
);
const NUMBER_WIDTH = 25.88;
// for 3 digits
const initialVisualizerState = (numElms) => {
  return {
    active: false,
    swapped: Array(numElms).fill(false),
    sorted: Array(numElms).fill(false),
    operationBlock: Array(numElms).fill(false),
    recursionBlock: Array(numElms).fill(false),
    mergeBlock: Array(numElms).fill(false),
    observed: Array(numElms).fill(false),
    delay: 500,
    timeOuts: [],
    minIndex: Array(numElms).fill(false),
  };
};
function SortingVisualizer() {
  // console.log(testAlgo(shellSort));
  const [rangeIp, setRangeIp] = useState(100);
  const [array, setArray] = useState(randomArray(MAX_BARS));
  const [showNumbers, setShowNumbers] = useState(false);
  const [visualizerState, setVisualizerState] = useState(() => {
    return initialVisualizerState(MAX_BARS);
  });
  const [gamePaused, setGamePaused] = useState(false);

  const numElms = (range = rangeIp) => Math.floor((MAX_BARS * range) / 100);

  const resetArray = () => {
    setArray(randomArray(numElms()));
    // console.log(visualizerState.timeOuts);
    for (let timer of visualizerState.timeOuts) {
      timer.clear();
    }
    setVisualizerState((vs) => ({
      ...initialVisualizerState(numElms()),
      delay: vs.delay,
    }));
  };
  const digitsAccomodated = (range = rangeIp) =>
    NUMBER_WIDTH * numElms(range) < BARS_TOTAL_WIDTH;

  const maxRangeWhenShowingNumbers = () =>
    (Math.floor(BARS_TOTAL_WIDTH / NUMBER_WIDTH) / numElms(100)) * 100;

  useEffect(() => {
    resetArray();
  }, [rangeIp]);
  useEffect(() => {
    if (gamePaused) {
      for (let timer of visualizerState.timeOuts) {
        timer.pause();
      }
    } else {
      for (let timer of visualizerState.timeOuts) {
        timer.resume();
      }
    }
  }, [gamePaused]);
  return (
    <div className={styles.container}>
      <h2>Sorting Visualizer</h2>
      <div className={styles.visualizerBlock}>
        {array.map((v, i) => (
          <div key={i} className={styles.barWrapper}>
            <div
              className={styles.bar}
              style={{
                height: v + 'px',
                backgroundColor: visualizerState.swapped[i]
                  ? 'red'
                  : visualizerState.observed[i]
                  ? 'green'
                  : visualizerState.sorted[i]
                  ? 'blue'
                  : visualizerState.minIndex[i]
                  ? 'purple'
                  : visualizerState.operationBlock[i]
                  ? 'lightblue'
                  : visualizerState.mergeBlock[i]
                  ? 'lightblue'
                  : visualizerState.recursionBlock[i]
                  ? 'rgb(243, 217, 69)'
                  : 'aqua',
                margin: `0 ${MARGIN_WIDTH_BAR}px`,
              }}
            ></div>
            {showNumbers && <div className={styles.number}>{v}</div>}
          </div>
        ))}
      </div>
      <div className={styles.buttons}>
        <button onClick={() => setGamePaused(!gamePaused)}>
          {gamePaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={resetArray}>
          {!visualizerState.active ? 'Generate New Array' : 'Reset'}
        </button>
        <span>
          <label>Number of Elements: </label>
          <input
            type="range"
            min={5}
            value={rangeIp}
            onChange={(e) => {
              if (!visualizerState.active) {
                if (showNumbers) {
                  if (digitsAccomodated(e.target.value)) {
                    setRangeIp(e.target.value);
                  } else {
                    setRangeIp(maxRangeWhenShowingNumbers());
                  }
                } else {
                  setRangeIp(e.target.value);
                }
              }
            }}
          ></input>
        </span>
        <span>
          <label>Speed: </label>
          <input
            type="range"
            value={100 - visualizerState.delay / 10}
            onChange={(e) => {
              if (visualizerState.active) {
                resetArray();
              }
              setVisualizerState((vs) => {
                return {
                  ...vs,
                  delay: (100 - e.target.value) * 10,
                };
              });
            }}
          ></input>
        </span>
        <span>
          <label>Show Numbers: </label>
          <input
            type="checkbox"
            value={showNumbers}
            onChange={(e) => {
              if (!e.target.checked) {
                setShowNumbers(false);
              } else if (digitsAccomodated()) {
                // 25.88px is width of one 3 digit number
                setShowNumbers(true);
              } else {
                setRangeIp(maxRangeWhenShowingNumbers());
                setShowNumbers(true);
              }
            }}
          ></input>
        </span>
        <button
          onClick={() => {
            if (!visualizerState.active) {
              mergeSort(
                [...array],
                visualizerState,
                setArray,
                setVisualizerState,
              );
            }
          }}
        >
          MergeSort
        </button>
        <button
          onClick={() => {
            if (!visualizerState.active) {
              bubbleSort(
                [...array],
                visualizerState,
                setArray,
                setVisualizerState,
              );
            }
          }}
        >
          BubbleSort
        </button>
        <button
          onClick={() => {
            if (!visualizerState.active) {
              selectionSort(
                [...array],
                visualizerState,
                setArray,
                setVisualizerState,
              );
            }
          }}
        >
          SelectionSort
        </button>
        <button
          onClick={() => {
            if (!visualizerState.active) {
              quickSort(
                [...array],
                visualizerState,
                setArray,
                setVisualizerState,
              );
            }
          }}
        >
          QuickSort
        </button>
        <button
          onClick={() => {
            if (!visualizerState.active) {
              insertionSort(
                [...array],
                visualizerState,
                setArray,
                setVisualizerState,
              );
            }
          }}
        >
          InsertionSort
        </button>
        <button
          onClick={() => {
            if (!visualizerState.active) {
              radixSort(
                [...array],
                visualizerState,
                setArray,
                setVisualizerState,
              );
            }
          }}
        >
          RadixSort
        </button>
        <button
          onClick={() => {
            if (!visualizerState.active) {
              shellSort(
                [...array],
                visualizerState,
                setArray,
                setVisualizerState,
              );
            }
          }}
        >
          ShellSort
        </button>
      </div>
    </div>
  );
}

export default SortingVisualizer;
