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
          nodesVisited: vs.nodesVisited.map(
            (_, idx) =>
              idx === nodes.findIndex((node) => node.num === sourceNode.num),
          ),
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );

  while (queue.length !== 0) {
    const path = queue.shift();
    const tempNode = path[path.length - 1].node;
    if (tempNode.num === destinationNode.num) {
      traversePath(
        path,
        nodes,
        edges,
        visualizerState,
        setVisualizerState,
        timeOuts,
      );
      break;
    }
    for (let edge of tempNode.originatingEdges) {
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
