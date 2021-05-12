import React, { useState, useEffect } from 'react';
import styles from './NQueens.module.css';
import crownIcon from '../../icons/crown.png';
import { randomIntBetween } from '../../utils';
import { nQueenSolver } from '../algos/nQueenSolver';
import { genArray } from '../algos/common';
import TopBar from '../../TopBar/TopBar';
import Button from '../../shared/Button';

const generateSampleSolution = (n) => {
  const solutions = [];
  for (let k = 0; k < 10; k++) {
    const solution = [];
    for (let i = 0; i < n; i++) {
      const row = Array(n).fill(false);
      row[randomIntBetween(0, n - 1)] = true;
      solution.push(row);
    }
    solutions.push(solution);
  }
  return solutions;
};
const initialVisualizerState = () => {
  return {
    active: false,
    delay: 100,
    timeOuts: [],
  };
};
function NQueens({ setActive }) {
  const [gamePaused, setGamePaused] = useState(false);
  // generateSampleSolution(4)
  const [n, setN] = useState(4);
  const [solutions, setSolutions] = useState([genArray(n, n)]);

  const [visualizerState, setVisualizerState] = useState(() => {
    return initialVisualizerState();
  });
  const reset = () => {
    for (let timer of visualizerState.timeOuts) {
      timer.clear();
    }
    setVisualizerState((vs) => ({
      ...initialVisualizerState(),
      delay: vs.delay,
    }));
    setSolutions([genArray(n, n)]);
  };
  useEffect(() => {
    reset();
  }, [n]);
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
    <div className="container">
      <TopBar header="NQueen Solver">
        <Button onClick={reset}>Reset</Button>
        <Button onClick={() => setGamePaused(!gamePaused)}>
          {gamePaused ? 'Resume' : 'Pause'}
        </Button>

        <Button>
          <label>Speed: </label>
          <input
            type="range"
            max={100}
            value={100 - visualizerState.delay / 10}
            onChange={(e) => {
              if (visualizerState.active) {
                reset();
              }
              setVisualizerState((vs) => {
                return {
                  ...vs,
                  delay: (100 - e.target.value) * 10,
                };
              });
            }}
          ></input>
        </Button>
        <Button>
          <label>Board - N x N : </label>
          <input
            type="number"
            value={n}
            onChange={(e) => {
              setN(+e.target.value);
            }}
          ></input>
        </Button>
        <Button
          onClick={() => {
            if (!visualizerState.active) {
              nQueenSolver(
                n,
                setSolutions,
                visualizerState,
                setVisualizerState,
              );
            }
          }}
        >
          Start
        </Button>
        <Button onClick={() => setActive('sudoku')}>Sudoku Solver</Button>
      </TopBar>
      <div>
        <div>
          <div>
            <Solution solution={solutions[solutions.length - 1]} n={n} />
          </div>
          <div className={styles.solutions}>
            {solutions.slice(0, solutions.length - 1).map((solution, k) => (
              <Solution key={k} solution={solution} n={n} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function Solution({ solution, n }) {
  return (
    <div className={styles.solution}>
      {solution.map((row, i) => (
        <div className={styles.row} key={i}>
          {row.map((block, j) => (
            <div
              className={styles.block}
              key={j}
              style={{
                padding: `${32 / n}px ${64 / n}px`,
                width: `${160 / n}px`,
                height: `${160 / n}px`,
              }}
            >
              {block ? <img src={crownIcon}></img> : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default NQueens;
