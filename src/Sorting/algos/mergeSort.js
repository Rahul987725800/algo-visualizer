import { Timer } from '../../utils';
const mergeSort = (arr, visualizerState, setArray, setVisualizerState) => {
  setVisualizerState((vs) => ({ ...vs, active: true }));
  let timeOuts = [];
  mergeSortHelper(
    arr,
    0,
    arr.length - 1,
    visualizerState,
    setArray,
    setVisualizerState,
    timeOuts,
  );
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
const mergeSortHelper = (
  arr,
  start,
  end,
  visualizerState,
  setArray,
  setVisualizerState,
  timeOuts,
) => {
  if (start < end) {
    const mid = Math.floor((start + end) / 2);
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            recursionBlock: vs.recursionBlock.map((_, idx) => {
              return idx >= start && idx <= mid;
            }),
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
    mergeSortHelper(
      arr,
      start,
      mid,
      visualizerState,
      setArray,
      setVisualizerState,
      timeOuts,
    );
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            recursionBlock: vs.recursionBlock.map((_, idx) => {
              return idx >= mid + 1 && idx <= end;
            }),
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );

    mergeSortHelper(
      arr,
      mid + 1,
      end,
      visualizerState,
      setArray,
      setVisualizerState,
      timeOuts,
    );

    merge(
      arr,
      start,
      mid,
      end,
      visualizerState,
      setArray,
      setVisualizerState,
      timeOuts,
    );
  } else {
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            sorted: vs.sorted.map((v, idx) => (idx === start ? true : v)),
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
  }
};
const merge = (
  arr,
  start,
  mid,
  end,
  visualizerState,
  setArray,
  setVisualizerState,
  timeOuts,
) => {
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          mergeBlock: vs.mergeBlock.map((_, idx) => idx >= start && idx <= end),
          sorted: vs.sorted.map((v, idx) =>
            idx >= start && idx <= end ? false : v,
          ),
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );
  const tempArr = Array(end - start + 1);
  let i = start;
  let j = mid + 1;
  let k = 0;
  while (i <= mid && j <= end) {
    if (arr[i] < arr[j]) {
      tempArr[k] = arr[i];
      k++;
      i++;
    } else {
      tempArr[k] = arr[j];
      k++;
      j++;
    }
  }
  while (i <= mid) {
    tempArr[k] = arr[i];
    k++;
    i++;
  }
  while (j <= end) {
    tempArr[k] = arr[j];
    k++;
    j++;
  }

  k = 0;
  for (let t = start; t <= end; t++, k++) {
    arr[t] = tempArr[k];
    const arrc = [...arr];
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            sorted: vs.sorted.map((v, idx) => (idx === t ? true : v)),
          };
        });
        setArray(arrc);
      }, visualizerState.delay * timeOuts.length),
    );
  }
};
export default mergeSort;
