import { Timer } from '../../utils';
export function traversePath(
  path,
  visualizerState,
  setVisualizerState,
  timeOuts,
) {
  for (let { node, edge } of path) {
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            edgesFinalized: { ...vs.edgesFinalized, [edge?.id]: true },
            nodesFinalized: { ...vs.nodesFinalized, [node.num]: true },
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
  }
}
