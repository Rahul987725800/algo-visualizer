import { Timer } from '../../utils';
const insertionSort = (arr, visualizerState, setArray, setVisualizerState) => {
  setVisualizerState((vs) => ({ ...vs, active: true }));
  let timeOuts = [];
  for (let i = 1; i < arr.length; i++) {
    for (let j = i; j > 0 && arr[j] < arr[j - 1]; j--) {
      timeOuts.push(
        new Timer(() => {
          setVisualizerState((vs) => {
            return {
              ...vs,
              swapped: vs.swapped.map((_, idx) => idx === j || idx === j - 1),
            };
          });
        }, visualizerState.delay * timeOuts.length),
      );
      [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
      const arrc = [...arr];
      timeOuts.push(
        new Timer(() => {
          setVisualizerState((vs) => {
            return {
              ...vs,
              swapped: vs.swapped.fill(false),
            };
          });
          setArray(arrc);
        }, visualizerState.delay * timeOuts.length),
      );
    }
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            sorted: vs.sorted.map((v, idx) => (idx === i - 1 ? true : v)),
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
  }
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          sorted: vs.sorted.map((v, idx) =>
            idx === arr.length - 1 ? true : v,
          ),
          active: false,
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
};
export default insertionSort;
