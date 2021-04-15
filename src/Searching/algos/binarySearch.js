import { Timer } from '../../utils';
export const binarySearch = (arr, e, visualizerState, setVisualizerState) => {
  setVisualizerState((vs) => ({
    ...vs,
    active: true,
    found: vs.found.fill(false),
  }));

  let timeOuts = [];
  let n = arr.length;
  let l = 0;
  let h = n - 1;
  while (l <= h) {
    let lc = l;
    let hc = h;
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            operationBlock: vs.operationBlock.map(
              (_, idx) => idx >= lc && idx <= hc,
            ),
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
    let m = Math.floor((l + h) / 2);
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            observed: vs.observed.map((_, idx) => idx === m),
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
    if (arr[m] === e) {
      timeOuts.push(
        new Timer(() => {
          setVisualizerState((vs) => {
            return {
              ...vs,
              observed: vs.observed.fill(false),
              found: vs.found.map((_, idx) => idx === m),
              active: false,
            };
          });
        }, visualizerState.delay * timeOuts.length),
      );
      return true;
    } else if (e < arr[m]) {
      h = m - 1;
    } else {
      l = m + 1;
    }
  }
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          operationBlock: vs.operationBlock.fill(false),
          observed: vs.observed.fill(false),
          active: false,
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
  return false;
};
