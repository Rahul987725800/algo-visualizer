import { Timer } from '../../utils';
import { traversePath } from './common';
export const depthFirstSearch = (
  source,
  destination,
  nodes,
  edges,
  visualizerState,
  setVisualizerState,
) => {
  const sourceNode = nodes.find((node) => node.num === source);
  const destinationNode = nodes.find((node) => node.num === destination);
  // console.log(sourceNode, destinationNode, nodes, edges, visualizerState);
  const edgesTracker = {};
  for (let edge of edges) {
    edgesTracker[edge.id] = false;
  }
  const nodesTracker = {};
  for (let node of nodes) {
    nodesTracker[node.num] = false;
  }
  setVisualizerState((vs) => ({
    ...vs,
    active: true,
    edgesVisited: { ...edgesTracker },
    nodesVisited: { ...nodesTracker },
    edgesFinalized: { ...edgesTracker },
    nodesFinalized: { ...nodesTracker },
  }));
  let timeOuts = [];
  const visited = {};
  for (let node of nodes) {
    visited[node.num] = false;
  }
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          nodesVisited: { ...vs.nodesVisited, [sourceNode.num]: true },
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );
  const path = helper(
    sourceNode,
    destinationNode,
    nodes,
    edges,
    visited,

    visualizerState,
    setVisualizerState,
    timeOuts,
  );
  traversePath(path, visualizerState, setVisualizerState, timeOuts);
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
};

function helper(
  sourceNode,
  destinationNode,
  nodes,
  edges,
  visited,
  visualizerState,
  setVisualizerState,
  timeOuts,
) {
  visited[sourceNode.num] = true;

  if (sourceNode.num === destinationNode.num)
    return [{ node: sourceNode, edge: null }];
  for (let edge of sourceNode.originatingEdges) {
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            edgesVisited: { ...vs.edgesVisited, [edge.id]: true },
            nodesVisited: { ...vs.nodesVisited, [edge.endNode]: true },
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
    if (!visited[edge.endNode]) {
      const nextNode = nodes.find((node) => node.num === edge.endNode);
      const pathRem = helper(
        nextNode,
        destinationNode,
        nodes,
        edges,
        visited,
        visualizerState,
        setVisualizerState,
        timeOuts,
      );
      if (pathRem.length) {
        return [{ node: sourceNode, edge }, ...pathRem];
      }
    }
  }
  return [];
}
