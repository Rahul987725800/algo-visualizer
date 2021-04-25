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
  setVisualizerState((vs) => ({
    ...vs,
    active: true,
    edgesVisited: Array(edges.length).fill(false),
    nodesVisited: Array(nodes.length).fill(false),
    edgesFinalized: Array(edges.length).fill(false),
    nodesFinalized: Array(nodes.length).fill(false),
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
          nodesVisited: vs.nodesVisited.map(
            (_, idx) =>
              idx === nodes.findIndex((node) => node.num === sourceNode.num),
          ),
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
  traversePath(
    path,
    nodes,
    edges,
    visualizerState,
    setVisualizerState,
    timeOuts,
  );
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
          const indexForEdge = edges.findIndex((e) => e.id === edge.id);
          const indexForEndNode = nodes.findIndex(
            (node) => node.num === edge.endNode,
          );
          return {
            ...vs,
            edgesVisited: vs.edgesVisited.map((val, idx) => {
              if (idx === indexForEdge) return true;
              return val;
            }),
            nodesVisited: vs.nodesVisited.map((val, idx) => {
              if (idx === indexForEndNode) {
                return true;
              }
              return val;
            }),
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
