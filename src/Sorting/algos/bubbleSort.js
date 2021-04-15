import { Timer } from '../../utils';
const bubbleSort = (arr, visualizerState, setArray, setVisualizerState) => {
  setVisualizerState((vs) => ({ ...vs, active: true }));

  let timeOuts = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j + 1] < arr[j]) {
        [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
        const arrc = [...arr];
        timeOuts.push(
          new Timer(() => {
            setVisualizerState((vs) => {
              return {
                ...vs,
                swapped: vs.swapped.map((_, idx) => idx === j || idx === j + 1),
                observed: vs.observed.fill(false),
              };
            });
          }, visualizerState.delay * timeOuts.length),
        );

        timeOuts.push(
          new Timer(() => {
            setVisualizerState((vs) => {
              return {
                ...vs,
                observed: vs.observed.map(
                  (_, idx) => idx === j || idx === j + 1,
                ),
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
                observed: vs.observed.map(
                  (_, idx) => idx === j || idx === j + 1,
                ),
              };
            });
          }, visualizerState.delay * timeOuts.length),
        );
      }
    }

    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            sorted: vs.sorted.map((v, idx) =>
              idx === arr.length - i - 1 ? true : v,
            ),
            observed: vs.observed.fill(false),
            active: arr.length - i - 1 === 0 ? false : true,
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
  }
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
};
export default bubbleSort;
