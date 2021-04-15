import { Timer } from '../../utils';
const shellSort = (arr, visualizerState, setArray, setVisualizerState) => {
  setVisualizerState((vs) => ({ ...vs, active: true }));
  let timeOuts = [];
  let len = arr.length;

  for (let gap = Math.floor(len / 2); gap >= 1; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < len; i += gap) {
      for (let j = i; j - gap >= 0; j -= gap) {
        if (arr[j] < arr[j - gap]) {
          timeOuts.push(
            new Timer(() => {
              setVisualizerState((vs) => {
                return {
                  ...vs,
                  observed: vs.observed.fill(false),
                  swapped: vs.swapped.map(
                    (_, idx) => idx === j || idx === j - gap,
                  ),
                };
              });
            }, visualizerState.delay * timeOuts.length),
          );
          [arr[j - gap], arr[j]] = [arr[j], arr[j - gap]];
          const arrc = [...arr];
          timeOuts.push(
            new Timer(() => {
              setVisualizerState((vs) => {
                return {
                  ...vs,
                  observed: vs.observed.map(
                    (_, idx) => idx === j || idx === j - gap,
                  ),
                  sorted:
                    gap === 1
                      ? vs.sorted.map((v, idx) => (idx === j - gap ? true : v))
                      : vs.sorted,
                  swapped: vs.swapped.fill(false),
                };
              });
              setArray(arrc);
            }, visualizerState.delay * timeOuts.length),
          );
        } else {
          timeOuts.push(
            new Timer(() => {
              setVisualizerState((vs) => {
                return {
                  ...vs,
                  observed: vs.observed.fill(false),
                  observed: vs.observed.map(
                    (_, idx) => idx === j || idx === j - gap,
                  ),
                  sorted:
                    gap === 1
                      ? vs.sorted.map((v, idx) => (idx === j - gap ? true : v))
                      : vs.sorted,
                };
              });
            }, visualizerState.delay * timeOuts.length),
          );
          break;
        }
      }
    }
  }
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          active: false,
          observed: vs.observed.fill(false),
          sorted: vs.sorted.map((v, idx) => (idx === len - 1 ? true : v)),
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
};
export default shellSort;
