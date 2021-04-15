export const twoDCopy = (arr) => {
  let arrc = [];
  for (let row of arr) {
    let rowc = [...row];
    arrc.push(rowc);
  }
  return arrc;
};
export function genArray(ROWS, COLUMNS) {
  let arr = [];
  for (let i = 0; i < ROWS; i++) {
    arr.push(Array(COLUMNS).fill(false));
  }
  return arr;
}
