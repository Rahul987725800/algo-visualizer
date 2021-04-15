import { Timer } from '../../utils';
import { twoDCopy, genArray } from './common';

let board;
let cols;
let diag1;
let diag2;
export const nQueenSolver = (
  n,
  setSolutions,
  visualizerState,
  setVisualizerState,
) => {
  setVisualizerState((vs) => ({
    ...vs,
    active: true,
  }));
  let timeOuts = [];
  board = genArray(n, n);
  cols = Array(n).fill(false);
  diag1 = Array(n * 2 - 1).fill(false);
  diag2 = Array(n * 2 - 1).fill(false);
  helper(0, n, setSolutions, visualizerState, setVisualizerState, timeOuts);
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          active: false,
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
};

const helper = (
  r,
  n,
  setSolutions,
  visualizerState,
  setVisualizerState,
  timeOuts,
) => {
  if (r == n) {
    timeOuts.push(
      new Timer(() => {}, 2 * visualizerState.delay * timeOuts.length),
    );
    timeOuts.push(
      new Timer(() => {
        setSolutions((solutions) => {
          const lastSolution = twoDCopy(solutions[solutions.length - 1]);
          return [...solutions, lastSolution];
        });
      }, visualizerState.delay * timeOuts.length),
    );
    timeOuts.push(
      new Timer(() => {}, 2 * visualizerState.delay * timeOuts.length),
    );
    return;
  }
  for (let c = 0; c < n; c++) {
    timeOuts.push(
      new Timer(() => {
        setSolutions((solutions) => {
          const lastSolution = twoDCopy(solutions[solutions.length - 1]);
          lastSolution[r][c] = true;
          return [...solutions.slice(0, solutions.length - 1), lastSolution];
        });
      }, visualizerState.delay * timeOuts.length),
    );

    if (isValid(r, c, n)) {
      board[r][c] = true;
      assign(r, c, n, true);
      helper(
        r + 1,
        n,
        setSolutions,
        visualizerState,
        setVisualizerState,
        timeOuts,
      );
      board[r][c] = false;
      assign(r, c, n, false);
    }
    timeOuts.push(
      new Timer(() => {
        setSolutions((solutions) => {
          const lastSolution = twoDCopy(solutions[solutions.length - 1]);
          lastSolution[r][c] = false;
          return [...solutions.slice(0, solutions.length - 1), lastSolution];
        });
      }, visualizerState.delay * timeOuts.length),
    );
  }
};
const assign = (r, c, n, val) => {
  cols[c] = val;
  diag1[r - c + n - 1] = val;
  diag2[r + c] = val;
};
const isValid = (r, c, n) => {
  if (cols[c] || diag1[r - c + n - 1] || diag2[r + c]) {
    return false;
  }
  return true;
};
