import { Timer } from '../../utils';
import { twoDCopy, genArray } from './common';

export const sudokuSolver = (
  board,
  setBoard,
  visualizerState,
  setVisualizerState,
) => {
  setVisualizerState((vs) => ({
    ...vs,
    active: true,
  }));
  let timeOuts = [];
  let result = helper(
    0,
    0,
    board,
    setBoard,
    visualizerState,
    setVisualizerState,
    timeOuts,
  );
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
  return result;
};
const helper = (
  r,
  c,
  board,
  setBoard,
  visualizerState,
  setVisualizerState,
  timeOuts,
) => {
  if (r == 9) {
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => ({
          ...vs,
          active: false,
          correct: genArray(9, 9),
        }));
      }, visualizerState.delay * timeOuts.length),
    );
    return true;
  }
  let nr;
  let nc;
  if (c == 8) {
    nr = r + 1;
    nc = 0;
  } else {
    nr = r;
    nc = c + 1;
  }
  if (board[r][c] === 0) {
    for (let v = 1; v <= 9; v++) {
      let boardc1 = twoDCopy(board);
      boardc1[r][c] = v;
      timeOuts.push(
        new Timer(() => {
          setBoard(boardc1);
          setVisualizerState((vs) => {
            return {
              ...vs,
              correct: genArray(9, 9),
              incorrect: genArray(9, 9),
            };
          });
        }, visualizerState.delay * timeOuts.length),
      );
      if (isValid(v, r, c, board)) {
        board[r][c] = v;
        timeOuts.push(
          new Timer(() => {
            setVisualizerState((vs) => {
              const uCorrect = genArray(9, 9);
              uCorrect[r][c] = true;
              return {
                ...vs,
                correct: uCorrect,
              };
            });
          }, visualizerState.delay * timeOuts.length),
        );
        if (
          helper(
            nr,
            nc,
            board,
            setBoard,
            visualizerState,
            setVisualizerState,
            timeOuts,
          )
        )
          return true;
        board[r][c] = 0;
      }
      timeOuts.push(
        new Timer(() => {
          setVisualizerState((vs) => {
            const uIncorrect = genArray(9, 9);
            uIncorrect[r][c] = true;
            return {
              ...vs,
              incorrect: uIncorrect,
            };
          });
        }, visualizerState.delay * timeOuts.length),
      );
      let boardc2 = twoDCopy(board);
      timeOuts.push(
        new Timer(() => {
          setBoard(boardc2);
        }, visualizerState.delay * timeOuts.length),
      );
    }
  } else {
    return helper(
      nr,
      nc,
      board,
      setBoard,
      visualizerState,
      setVisualizerState,
      timeOuts,
    );
  }
};

const isValid = (v, r, c, board) => {
  for (let i = 0; i < 9; i++) {
    if (board[i][c] === v) return false;
  }
  for (let j = 0; j < 9; j++) {
    if (board[r][j] === v) return false;
  }
  let rs = Math.floor(r / 3) * 3;
  let cs = Math.floor(c / 3) * 3;
  for (let i = rs; i < rs + 3; i++) {
    for (let j = cs; j < cs + 3; j++) {
      if (board[i][j] === v) {
        return false;
      }
    }
  }
  return true;
};
