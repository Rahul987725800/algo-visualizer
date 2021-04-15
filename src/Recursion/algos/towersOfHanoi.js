import { Timer } from '../../utils';
// active false login not implemented
const helper = (
  n,
  a,
  b,
  c,
  setDisks,
  visualizerState,
  setVisualizerState,
  timeOuts,
) => {
  if (n === 0) {
    return;
  }
  helper(
    n - 1,
    a,
    c,
    b,
    setDisks,
    visualizerState,
    setVisualizerState,
    timeOuts,
  );
  timeOuts.push(
    new Timer(() => {
      setDisks((pd) => {
        return pd.map((d) => {
          if (d.number === n) {
            return {
              ...d,
              showOn: b,
            };
          }
          return d;
        });
      });
    }, visualizerState.delay * timeOuts.length),
  );
  helper(
    n - 1,
    c,
    b,
    a,
    setDisks,
    visualizerState,
    setVisualizerState,
    timeOuts,
  );
};
export const towersOfHanoi = (
  n,
  setDisks,
  visualizerState,
  setVisualizerState,
) => {
  setVisualizerState((vs) => ({
    ...vs,
    active: true,
  }));
  let timeOuts = [];
  helper(
    n,
    'A',
    'B',
    'C',
    setDisks,
    visualizerState,
    setVisualizerState,
    timeOuts,
  );
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
};
