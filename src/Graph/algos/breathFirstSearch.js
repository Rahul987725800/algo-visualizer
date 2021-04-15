import { Timer } from '../../utils';
import { point, pointEq, twoDCopy, genArray } from './common';
let instantState = {};
export const breathFirstSearch = (
  rows,
  cols,
  source,
  destination,
  wall,
  visualizerState,
  setVisualizerState,
  startedFromClick,
) => {
  const ROWS = visualizerState.pathTraversed.length;
  const COLUMNS = visualizerState.pathTraversed[0].length;
  if (startedFromClick) {
    setVisualizerState((vs) => {
      return {
        ...vs,
        runAlgo: 'bfs',
        active: true,
        pathTraversed: genArray(ROWS, COLUMNS),
        backTrack: genArray(ROWS, COLUMNS),
      };
    });
  } else {
    instantState.pathTraversed = genArray(ROWS, COLUMNS);
    instantState.backTrack = genArray(ROWS, COLUMNS);
  }
  function check(next, path) {
    if (pointEq(destination, point(next.i, next.j))) {
      for (let k = path.length - 1; k >= 0; k--) {
        if (startedFromClick) {
          timeOuts.push(
            new Timer(() => {
              setVisualizerState((vs) => {
                let updatedBackTrack = twoDCopy(vs.backTrack);
                updatedBackTrack[path[k].i][path[k].j] = true;
                let updatedPathTraversed = twoDCopy(vs.pathTraversed);
                updatedPathTraversed[path[k].i][path[k].j] = false;
                return {
                  ...vs,
                  backTrack: updatedBackTrack,
                  pathTraversed: updatedPathTraversed,
                  active: k === 0 ? false : true,
                };
              });
            }, visualizerState.delay * timeOuts.length),
          );
        } else {
          instantState.backTrack[path[k].i][path[k].j] = true;
          instantState.pathTraversed[path[k].i][path[k].j] = false;
        }
      }
      if (startedFromClick) {
        setVisualizerState((vs) => ({ ...vs, timeOuts }));
      } else {
        setVisualizerState((vs) => ({ ...vs, timeOuts, ...instantState }));
      }
      return true;
    }
    queue.push([...path, point(next.i, next.j)]);
    visited[next.i][next.j] = true;
    if (startedFromClick) {
      timeOuts.push(
        new Timer(() => {
          setVisualizerState((vs) => {
            let updatedPathTraversed = twoDCopy(vs.pathTraversed);
            updatedPathTraversed[next.i][next.j] = true;
            return {
              ...vs,
              pathTraversed: updatedPathTraversed,
            };
          });
        }, visualizerState.delay * timeOuts.length),
      );
    } else {
      instantState.pathTraversed[next.i][next.j] = true;
    }

    return false;
  }

  let timeOuts = [];
  const visited = [];
  for (let i = 0; i < rows; i++) {
    visited.push(Array(cols).fill(false));
  }
  const queue = [];
  queue.push([{ ...source }]);
  visited[source.i][source.j] = true;
  while (queue.length !== 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    if (
      current.i - 1 >= 0 &&
      !visited[current.i - 1][current.j] &&
      !wall[current.i - 1][current.j]
    ) {
      if (check(point(current.i - 1, current.j), path)) return true;
    }
    if (
      current.i + 1 < rows &&
      !visited[current.i + 1][current.j] &&
      !wall[current.i + 1][current.j]
    ) {
      if (check(point(current.i + 1, current.j), path)) return true;
    }
    if (
      current.j - 1 >= 0 &&
      !visited[current.i][current.j - 1] &&
      !wall[current.i][current.j - 1]
    ) {
      if (check(point(current.i, current.j - 1), path)) return true;
    }
    if (
      current.j + 1 < cols &&
      !visited[current.i][current.j + 1] &&
      !wall[current.i][current.j + 1]
    ) {
      if (check(point(current.i, current.j + 1), path)) return true;
    }
  }
  if (startedFromClick) {
    setVisualizerState((vs) => ({ ...vs, timeOuts }));
  } else {
    setVisualizerState((vs) => ({ ...vs, timeOuts, ...instantState }));
  }
  return false;
};
