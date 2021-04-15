import React, { useState, useEffect } from 'react';
import { generateRandomArray } from '../../utils.js';
import { binarySearch } from '../algos/binarySearch.js';
import { linearSearch } from '../algos/linearSearch.js';
import styles from './SearchingVisualizer.module.css';
const TOTAL_WIDTH = (window.innerWidth * 80) / 100;
const MAX_ELEMENTS = Math.floor(TOTAL_WIDTH / 48);
const initialVisualizerState = (numElms) => {
  return {
    active: false,
    found: Array(numElms).fill(false),
    operationBlock: Array(numElms).fill(false),
    observed: Array(numElms).fill(false),
    delay: 500,
    timeOuts: [],
  };
};
function SearchingVisualizer() {
  const [gamePaused, setGamePaused] = useState(false);
  const [numElems, setNumElems] = useState(MAX_ELEMENTS);
  const [array, setArray] = useState(generateRandomArray(numElems, 10, 99));
  const [rangeIp, setRangeIp] = useState(100);
  const [numberToSearch, setNumberToSearch] = useState(0);
  const [visualizerState, setVisualizerState] = useState(() => {
    return initialVisualizerState(numElems);
  });
  let resetArray = () => {
    let nElms = Math.floor((MAX_ELEMENTS * rangeIp) / 100);
    setArray(generateRandomArray(nElms, 10, 99));
    setNumElems(nElms);
    for (let timer of visualizerState.timeOuts) {
      timer.clear();
    }
    setVisualizerState((vs) => ({
      ...initialVisualizerState(nElms),
      delay: vs.delay,
    }));
  };
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
      <h2>Searching Visualizer</h2>
      <div>
        <div className={styles.array}>
          {array.map((v, i) => (
            <div
              key={i}
              className={styles.block}
              style={{
                backgroundColor: visualizerState.observed[i]
                  ? 'yellow'
                  : visualizerState.found[i]
                  ? 'lightgreen'
                  : visualizerState.operationBlock[i]
                  ? 'aqua'
                  : 'white',
              }}
            >
              {v}
            </div>
          ))}
        </div>
        <div>
          <button onClick={() => setGamePaused(!gamePaused)}>
            {gamePaused ? 'Resume' : 'Pause'}
          </button>
          <button onClick={() => resetArray()}>Reset</button>
          <label>Element : </label>
          <input
            type="number"
            value={numberToSearch}
            onChange={(e) => setNumberToSearch(e.target.value)}
          ></input>
          <label>Number of Elements : </label>
          <input
            type="range"
            min={20}
            value={rangeIp}
            onChange={(e) => {
              setRangeIp(e.target.value);
            }}
          ></input>
          <label>Speed: </label>
          <input
            type="range"
            max={90}
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
          <button
            onClick={() => {
              console.log(numberToSearch);
              if (!visualizerState.active) {
                linearSearch(
                  [...array],
                  +numberToSearch,
                  visualizerState,
                  setVisualizerState,
                );
              }
            }}
          >
            LinearSearch
          </button>
          <button
            onClick={() => {
              console.log(numberToSearch);
              if (!visualizerState.active) {
                binarySearch(
                  [...array],
                  +numberToSearch,
                  visualizerState,
                  setVisualizerState,
                );
              }
            }}
          >
            BinarySearch
          </button>
          <button
            onClick={() => {
              setArray((pa) => {
                let arr = [...pa];
                arr.sort((a, b) => a - b);
                return arr;
              });
            }}
          >
            Sort
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchingVisualizer;
