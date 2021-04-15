import { Timer } from '../../utils';
const selectionSort = (arr, visualizerState, setArray, setVisualizerState) => {
  setVisualizerState((vs) => ({ ...vs, active: true }));
  let timeOuts = [];

  for (let i = 0; i < arr.length; i++) {
    let minI = i;
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            minIndex: vs.minIndex.map((_, idx) => idx === i),
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );

    for (let j = i + 1; j < arr.length; j++) {
      timeOuts.push(
        new Timer(() => {
          setVisualizerState((vs) => {
            return {
              ...vs,
              observed: vs.observed.map((_, idx) => idx === j),
            };
          });
        }, visualizerState.delay * timeOuts.length),
      );

      if (arr[j] < arr[minI]) {
        minI = j;
        timeOuts.push(
          new Timer(() => {
            setVisualizerState((vs) => {
              return {
                ...vs,
                minIndex: vs.minIndex.map((_, idx) => idx === j),
                observed: vs.observed.fill(false),
              };
            });
          }, visualizerState.delay * timeOuts.length),
        );
      }
    }
    [arr[i], arr[minI]] = [arr[minI], arr[i]];
    const arrc = [...arr];
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            swapped: vs.swapped.map((_, idx) => idx === i || idx === minI),
            observed: vs.observed.fill(false),
            minIndex: vs.minIndex.fill(false),
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );

    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            sorted: vs.sorted.map((v, idx) => (idx === i ? true : v)),
            active: i === arr.length - 1 ? false : true,
            swapped: vs.swapped.fill(false),
          };
        });
        setArray(arrc);
      }, visualizerState.delay * timeOuts.length),
    );
  }
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
};
export default selectionSort;
