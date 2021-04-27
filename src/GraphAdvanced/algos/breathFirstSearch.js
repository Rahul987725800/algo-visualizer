import { Timer } from '../../utils';
import { traversePath } from './common';
export const breathFirstSearch = (
  source,
  destination,
  nodes,
  edges,
  visualizerState,
  setVisualizerState,
) => {
  // console.log(nodes);
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
  const queue = [];
  queue.push([
    {
      node: sourceNode,
      edge: null,
    },
  ]);
  visited[sourceNode.num] = true;
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
  const visitedEdges = new Set();
  while (queue.length !== 0) {
    const path = queue.shift();
    const tempNode = path[path.length - 1].node;
    if (tempNode.num === destinationNode.num) {
      traversePath(path, visualizerState, setVisualizerState, timeOuts);
      break;
    }
    for (let edge of tempNode.originatingEdges) {
      if (visitedEdges.has(edge.id)) continue;
      visitedEdges.add(edge.id);
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
        queue.push([
          ...path,
          {
            node: nodes.find((node) => node.num === edge.endNode),
            edge,
          },
        ]);
        visited[edge.endNode] = true;
      }
    }
  }

  setVisualizerState((vs) => ({ ...vs, timeOuts }));
};
