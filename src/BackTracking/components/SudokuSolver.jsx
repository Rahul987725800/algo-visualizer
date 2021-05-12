import React, { useState, useEffect } from 'react';
import Button from '../../shared/Button';
import TopBar from '../../TopBar/TopBar';
import { twoDCopy, genArray } from '../algos/common';
import { sudokuSolver } from '../algos/sudokuSolver';
import styles from './SudokuSolver.module.css';
let sampleBoard = [
  [5, 3, 0, 0, 7, 0, 0, 0, 2],
  [6, 0, 0, 1, 9, 5, 3, 0, 0],
  [0, 9, 8, 3, 0, 2, 0, 6, 0],
  [8, 0, 9, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 7, 0, 1],
  [7, 0, 0, 0, 2, 4, 0, 0, 6],
  [0, 6, 0, 0, 3, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [3, 0, 0, 0, 8, 0, 0, 7, 9],
];
const initialVisualizerState = () => {
  return {
    active: false,
    delay: 100,
    timeOuts: [],
    correct: genArray(9, 9),
    incorrect: genArray(9, 9),
    trial: genArray(9, 9),
  };
};
function SudokuSolver({ setActive }) {
  const [gamePaused, setGamePaused] = useState(false);
  const [visualizerState, setVisualizerState] = useState(() => {
    return initialVisualizerState();
  });
  const [board, setBoard] = useState(sampleBoard);
  const reset = () => {
    for (let timer of visualizerState.timeOuts) {
      timer.clear();
    }
    setVisualizerState((vs) => ({
      ...initialVisualizerState(),
      delay: vs.delay,
    }));
    setBoard(sampleBoard);
  };
  const blockColor = (i, j) => {
    if (sampleBoard[i][j] === 0) {
      if (board[i][j] === 0) return 'transparent';
      else return 'red';
    }
    return 'black';
  };
  const blockBackgroundColor = (i, j) => {
    switch (true) {
      case visualizerState.trial[i][j]:
        return 'yellow';
      case visualizerState.correct[i][j]:
        return 'lightgreen';
      case visualizerState.incorrect[i][j]:
        return 'orange';
    }
    return '';
  };
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
      <div>
        <div className={styles.board}>
          {board.map((row, i) => (
            <div className={styles.row} key={i}>
              {row.map((block, j) => (
                <div
                  className={styles.block}
                  key={j}
                  style={{
                    color: blockColor(i, j),
                    background: blockBackgroundColor(i, j),
                  }}
                >
                  {block}
                </div>
              ))}
            </div>
          ))}
        </div>
        <TopBar header="Sudoku Solver">
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
          <Button
            onClick={() => {
              if (!visualizerState.active) {
                sudokuSolver(
                  twoDCopy(board), // must send a copy
                  setBoard,
                  visualizerState,
                  setVisualizerState,
                );
              }
            }}
          >
            Start
          </Button>
          <Button onClick={() => setActive('nqueen')}>NQueen Solver</Button>
        </TopBar>
      </div>
    </div>
  );
}

export default SudokuSolver;
