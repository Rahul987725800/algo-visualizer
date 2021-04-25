import { Timer } from '../../utils';
export function traversePath(
  path,
  nodes,
  edges,
  visualizerState,
  setVisualizerState,
  timeOuts,
) {
  for (let { node, edge } of path) {
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          let updatedEdgesFinalized = vs.edgesFinalized;
          if (edge) {
            const indexForEdge = edges.findIndex((e) => e.id === edge.id);
            updatedEdgesFinalized = vs.edgesFinalized.map((val, idx) => {
              if (idx === indexForEdge) return true;
              return val;
            });
          }
          const indexForEndNode = nodes.findIndex((n) => n.num === node.num);
          return {
            ...vs,
            edgesFinalized: updatedEdgesFinalized,
            nodesFinalized: vs.nodesFinalized.map((val, idx) => {
              if (idx === indexForEndNode) {
                return true;
              }
              return val;
            }),
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
  }
}
