const twoDCopy = (arr) => {
  let arrc = [];
  for (let row of arr) {
    let rowc = [...row];
    arrc.push(rowc);
  }
  return arrc;
};
let board = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

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
const helper = (r, c, board) => {
  if (r == 9) {
    console.log(board);
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
      if (isValid(v, r, c, board)) {
        board[r][c] = v;
        if (helper(nr, nc, board)) return true;
        board[r][c] = 0;
      }
    }
  } else {
    return helper(nr, nc, board);
  }
};
const solve = (board) => {
  helper(0, 0, board);
};
solve(board);
