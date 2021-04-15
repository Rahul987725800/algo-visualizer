import { Timer } from '../../utils';
import { point, pointEq, twoDCopy, genArray } from './common';
let instantState = {};
export const deapthFirstSearch = (
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
        runAlgo: 'dfs',
        active: true,
        pathTraversed: genArray(ROWS, COLUMNS),
        backTrack: genArray(ROWS, COLUMNS),
      };
    });
  } else {
    instantState.pathTraversed = genArray(ROWS, COLUMNS);
    instantState.backTrack = genArray(ROWS, COLUMNS);
  }
  let timeOuts = [];
  const visited = [];
  for (let i = 0; i < rows; i++) {
    visited.push(Array(cols).fill(false));
  }
  visited[source.i][source.j] = true;
  const path = helper(
    rows,
    cols,
    source,
    source,
    destination,
    visited,
    wall,
    visualizerState,
    setVisualizerState,
    timeOuts,
    startedFromClick,
  );
  if (startedFromClick) {
    setVisualizerState((vs) => ({ ...vs, timeOuts }));
  } else {
    setVisualizerState((vs) => ({ ...vs, timeOuts, ...instantState }));
  }
  return path;
};
const checker = (
  rows,
  cols,
  source,
  current,
  destination,
  visited,
  next,
  wall,
  visualizerState,
  setVisualizerState,
  timeOuts,
  startedFromClick,
) => {
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

  const path = helper(
    rows,
    cols,
    source,
    next,
    destination,
    visited,
    wall,
    visualizerState,
    setVisualizerState,
    timeOuts,
    startedFromClick,
  );
  if (path.length) {
    path.unshift(current);
    if (pointEq(source, current)) {
      if (startedFromClick) {
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
      }
    } else {
      if (startedFromClick) {
        timeOuts.push(
          new Timer(() => {
            setVisualizerState((vs) => {
              let updatedBackTrack = twoDCopy(vs.backTrack);
              updatedBackTrack[current.i][current.j] = true;
              let updatedPathTraversed = twoDCopy(vs.pathTraversed);
              updatedPathTraversed[current.i][current.j] = false;
              return {
                ...vs,
                backTrack: updatedBackTrack,
                pathTraversed: updatedPathTraversed,
              };
            });
          }, visualizerState.delay * timeOuts.length),
        );
      } else {
        instantState.backTrack[current.i][current.j] = true;
        instantState.pathTraversed[current.i][current.j] = false;
      }
    }

    return path;
  }
  return [];
};
const helper = (
  rows,
  cols,
  source,
  current,
  destination,
  visited,
  wall,
  visualizerState,
  setVisualizerState,
  timeOuts,
  startedFromClick,
) => {
  if (pointEq(destination, current)) return [current];
  if (
    current.j + 1 < cols &&
    !visited[current.i][current.j + 1] &&
    !wall[current.i][current.j + 1]
  ) {
    const next = point(current.i, current.j + 1);
    const path = checker(
      rows,
      cols,
      source,
      current,
      destination,
      visited,
      next,
      wall,
      visualizerState,
      setVisualizerState,
      timeOuts,
      startedFromClick,
    );
    if (path.length) return path;
  }

  if (
    current.i + 1 < rows &&
    !visited[current.i + 1][current.j] &&
    !wall[current.i + 1][current.j]
  ) {
    const next = point(current.i + 1, current.j);
    const path = checker(
      rows,
      cols,
      source,
      current,
      destination,
      visited,
      next,
      wall,
      visualizerState,
      setVisualizerState,
      timeOuts,
      startedFromClick,
    );
    if (path.length) return path;
  }
  if (
    current.i - 1 >= 0 &&
    !visited[current.i - 1][current.j] &&
    !wall[current.i - 1][current.j]
  ) {
    const next = point(current.i - 1, current.j);
    const path = checker(
      rows,
      cols,
      source,
      current,
      destination,
      visited,
      next,
      wall,
      visualizerState,
      setVisualizerState,
      timeOuts,
      startedFromClick,
    );
    if (path.length) return path;
  }
  if (
    current.j - 1 >= 0 &&
    !visited[current.i][current.j - 1] &&
    !wall[current.i][current.j - 1]
  ) {
    const next = point(current.i, current.j - 1);
    const path = checker(
      rows,
      cols,
      source,
      current,
      destination,
      visited,
      next,
      wall,
      visualizerState,
      setVisualizerState,
      timeOuts,
      startedFromClick,
    );
    if (path.length) return path;
  }

  return [];
};
