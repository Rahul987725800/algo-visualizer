function genArray(ROWS, COLUMNS) {
  let arr = [];
  for (let i = 0; i < ROWS; i++) {
    arr.push(Array(COLUMNS).fill(false));
  }
  return arr;
}
const twoDCopy = (arr) => {
  let arrc = [];
  for (let row of arr) {
    let rowc = [...row];
    arrc.push(rowc);
  }
  return arrc;
};
const solutions = [];
let board;
let cols;
let diag1;
let diag2;
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
const helper = (r, n) => {
  if (r == n) {
    solutions.push(twoDCopy(board));
    return;
  }
  for (let c = 0; c < n; c++) {
    if (isValid(r, c, n)) {
      board[r][c] = true;
      assign(r, c, n, true);
      helper(r + 1, n, board);
      board[r][c] = false;
      assign(r, c, n, false);
    }
  }
};
const nqueen = (n) => {
  board = genArray(n, n);
  cols = Array(n).fill(false);
  diag1 = Array(n * 2 - 1).fill(false);
  diag2 = Array(n * 2 - 1).fill(false);
  helper(0, n);
};
nqueen(4);
for (let sol of solutions) {
  console.log(sol);
}
