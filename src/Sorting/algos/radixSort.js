import { Timer } from '../../utils';
const radixSort = (arr, visualizerState, setArray, setVisualizerState) => {
  setVisualizerState((vs) => ({ ...vs, active: true }));
  let timeOuts = [];
  let maxEl = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxEl) maxEl = arr[i];
  }
  for (let divisor = 1; divisor < maxEl; divisor *= 10) {
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            sorted: vs.sorted.fill(false),
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
    radixSortHelper(
      arr,
      divisor,
      visualizerState,
      setArray,
      setVisualizerState,
      timeOuts,
    );
  }
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
const radixSortHelper = (
  arr,
  divisor,
  visualizerState,
  setArray,
  setVisualizerState,
  timeOuts,
) => {
  const len = arr.length;
  let remainderArr = Array(10).fill(0);
  for (let v of arr) {
    remainderArr[Math.floor(v / divisor) % 10]++;
  }
  for (let i = 1; i < 10; i++) {
    remainderArr[i] += remainderArr[i - 1];
  }

  const dupArr = [...arr];
  for (let i = len - 1; i >= 0; i--) {
    let n = Math.floor(dupArr[i] / divisor) % 10;
    const index = --remainderArr[n];
    arr[index] = dupArr[i];
    const arrc = [...arr];
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            sorted: vs.sorted.map((v, idx) => (idx === index ? true : v)),
          };
        });
        setArray(arrc);
      }, visualizerState.delay * timeOuts.length),
    );
  }
};
export default radixSort;
