export function randomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function generateRandomArray(n, min = 1, max = 1000) {
  let arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(randomIntBetween(min, max));
  }
  return arr;
}

export class Timer {
  timerId;
  start;
  remaining;
  callback;
  constructor(callback, delay) {
    this.remaining = delay;
    this.callback = callback;
    this.start = Date.now();
    this.timerId = setTimeout(callback, delay);
  }
  pause() {
    clearTimeout(this.timerId);
    this.remaining -= Date.now() - this.start;
  }
  resume() {
    if (this.remaining >= -0.00000000001) {
      this.start = Date.now(); // important
      this.timerId = setTimeout(this.callback, this.remaining);
    }
  }
  clear() {
    clearTimeout(this.timerId);
  }
}
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
export class Debounce {
  callback;
  delay;
  timeOut;
  constructor(callback, delay) {
    this.callback = callback;
    this.delay = delay;
  }
  call(...args) {
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => this.callback(...args), this.delay);
  }
}
