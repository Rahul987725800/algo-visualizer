import { Timer } from '../../utils';
export const linearSearch = (arr, e, visualizerState, setVisualizerState) => {
  setVisualizerState((vs) => ({
    ...vs,
    active: true,
    found: vs.found.fill(false),
  }));
  let timeOuts = [];
  for (let i = 0; i < arr.length; i++) {
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            observed: vs.observed.map((_, idx) => idx === i),
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
    if (arr[i] === e) {
      timeOuts.push(
        new Timer(() => {
          setVisualizerState((vs) => {
            return {
              ...vs,
              observed: vs.observed.fill(false),
              found: vs.found.map((_, idx) => idx === i),
              active: false,
            };
          });
        }, visualizerState.delay * timeOuts.length),
      );
      return true;
    }
  }
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          observed: vs.observed.fill(false),
          active: false,
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
  return false;
};
