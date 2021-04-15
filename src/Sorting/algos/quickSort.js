import { Timer } from '../../utils';
const quickSort = (arr, visualizerState, setArray, setVisualizerState) => {
  setVisualizerState((vs) => ({ ...vs, active: true }));
  const timeOuts = [];
  quickSortHelper(
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
const quickSortHelper = (
  arr,
  start,
  end,
  visualizerState,
  setArray,
  setVisualizerState,
  timeOuts,
) => {
  if (start < end) {
    let pivot = partition(
      arr,
      start,
      end,
      visualizerState,
      setArray,
      setVisualizerState,
      timeOuts,
    );

    quickSortHelper(
      arr,
      start,
      pivot - 1,
      visualizerState,
      setArray,
      setVisualizerState,
      timeOuts,
    );
    quickSortHelper(
      arr,
      pivot + 1,
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
const partition = (
  arr,
  start,
  end,
  visualizerState,
  setArray,
  setVisualizerState,
  timeOuts,
) => {
  let i = start;
  let j = start + 1;
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          observed: vs.observed.map((_, idx) => idx === start),
          minIndex: vs.minIndex.map((_, idx) => idx === start),
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );
  while (j <= end) {
    const jc = j;
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            observed: vs.observed.map((_, idx) => idx === jc || idx === start),
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
    if (arr[j] < arr[start]) {
      i += 1;
      const ic = i;
      timeOuts.push(
        new Timer(() => {
          setVisualizerState((vs) => {
            return {
              ...vs,
              minIndex: vs.minIndex.map((_, idx) => idx === ic),
            };
          });
        }, visualizerState.delay * timeOuts.length),
      );
      timeOuts.push(
        new Timer(() => {
          setVisualizerState((vs) => {
            return {
              ...vs,
              swapped: vs.swapped.map((_, idx) => idx === ic || idx === jc),
              observed: vs.observed.map((_, idx) => idx === start),
            };
          });
        }, visualizerState.delay * timeOuts.length),
      );

      [arr[i], arr[j]] = [arr[j], arr[i]];
      const arrc = [...arr];
      timeOuts.push(
        new Timer(() => {
          setVisualizerState((vs) => {
            return {
              ...vs,
              observed: vs.observed.map(
                (_, idx) => idx === ic || idx === jc || idx === start,
              ),
              swapped: vs.swapped.fill(false),
            };
          });
          setArray(arrc);
        }, visualizerState.delay * timeOuts.length),
      );
    }
    j += 1;
  }
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          swapped: vs.swapped.map((_, idx) => idx === i || idx === start),
          minIndex: vs.minIndex.fill(false),
          observed: vs.observed.fill(false),
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );
  [arr[i], arr[start]] = [arr[start], arr[i]];
  const arrc = [...arr];
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          swapped: vs.swapped.fill(false),
          sorted: vs.sorted.map((v, idx) => (idx === i ? true : v)),
        };
      });
      setArray(arrc);
    }, visualizerState.delay * timeOuts.length),
  );

  return i;
};
export default quickSort;
