import { Timer } from '../../utils';

export function dijkstra(
  source,
  destination,
  nodes,
  edges,
  visualizerState,
  setVisualizerState,
) {
  const sourceNode = nodes.find((node) => node.num === source);
  nodes = nodes.map((node) => ({ ...node, distance: Number.MAX_VALUE }));
  const edgesTracker = {};
  for (let edge of edges) {
    edgesTracker[edge.id] = false;
  }
  const nodesTracker = {};
  for (let node of nodes) {
    nodesTracker[node.num] = false;
  }
  const dijkstraDistanceNodes = {};
  for (let node of nodes) {
    dijkstraDistanceNodes[node.num] = Number.MAX_VALUE;
  }
  setVisualizerState((vs) => ({
    ...vs,
    active: true,
    edgesVisited: { ...edgesTracker },
    nodesVisited: { ...nodesTracker },
    edgesFinalized: { ...edgesTracker },
    nodesFinalized: { ...nodesTracker },
    dijkstraDistanceNodes,
  }));
  let timeOuts = [];
  sourceNode.distance = 0;
  const nodesHeap = [];
  add(nodesHeap, sourceNode);
  const visited = {};
  for (let node of nodes) {
    visited[node.num] = false;
  }
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          dijkstraDistanceNodes: {
            ...vs.dijkstraDistanceNodes,
            [sourceNode.num]: 0,
          },
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );
  const visitedEdges = new Set();
  while (nodesHeap.length !== 0) {
    let tempNode = pop(nodesHeap);
    visited[tempNode.num] = true;
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            nodesVisited: { ...vs.nodesVisited, [tempNode.num]: true },
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
    if (tempNode.num === destination) {
      showTrack(tempNode, visualizerState, setVisualizerState, timeOuts);
      setVisualizerState((vs) => ({ ...vs, timeOuts }));
      return tempNode.distance;
    }
    const sortedEdges = tempNode.originatingEdges.sort(
      (e1, e2) => e1.length - e2.length,
    );
    // console.log(sortedEdges);
    for (let edge of sortedEdges) {
      // console.log(edge + 'before check');
      if (visitedEdges.has(edge.id)) continue;
      // console.log(edge + 'after check');
      visitedEdges.add(edge.id);
      timeOuts.push(
        new Timer(() => {
          setVisualizerState((vs) => {
            return {
              ...vs,
              edgesVisited: { ...vs.edgesVisited, [edge.id]: true },
            };
          });
        }, visualizerState.delay * timeOuts.length),
      );
      if (!visited[edge.endNode]) {
        let targetNode = nodes.find((node) => node.num === edge.endNode);
        if (tempNode.distance + edge.length < targetNode.distance) {
          remove(nodesHeap, targetNode);
          targetNode.distance = tempNode.distance + edge.length;
          targetNode.predecessor = {
            node: tempNode,
            edge,
          };
          add(nodesHeap, targetNode);
          timeOuts.push(
            new Timer(() => {
              setVisualizerState((vs) => {
                return {
                  ...vs,
                  dijkstraDistanceNodes: {
                    ...vs.dijkstraDistanceNodes,
                    [targetNode.num]: targetNode.distance,
                  },
                  nodesVisited: { ...vs.nodesVisited, [targetNode.num]: true },
                };
              });
            }, visualizerState.delay * timeOuts.length),
          );
        }
      }
    }
  }
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
  return Number.MAX_VALUE;
}
function showTrack(
  destinationNode,
  visualizerState,
  setVisualizerState,
  timeOuts,
) {
  let tempNode = destinationNode;
  while (tempNode.predecessor) {
    const num = tempNode.num;
    const edge = tempNode.predecessor.edge;
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            nodesFinalized: { ...vs.nodesFinalized, [num]: true },
            edgesFinalized: { ...vs.edgesFinalized, [edge.id]: true },
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
    tempNode = tempNode.predecessor.node;
  }
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          nodesFinalized: { ...vs.nodesFinalized, [tempNode.num]: true },
          active: false,
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );
}

const helper = (nodes, i) => {
  const n = nodes.length;
  let l = i * 2 + 1;
  let r = i * 2 + 2;
  let minI = i;
  if (l < n && nodes[l].distance < nodes[minI].distance) {
    minI = l;
  }
  if (r < n && nodes[r].distance < nodes[minI].distance) {
    minI = r;
  }
  if (minI !== i) {
    [nodes[i], nodes[minI]] = [nodes[minI], nodes[i]];
    helper(nodes, minI);
  }
};
const heapify = (nodes) => {
  const n = nodes.length;
  for (let i = Math.floor(n / 2); i >= 0; i--) {
    helper(nodes, i);
  }
};
function pop(nodes) {
  if (nodes.length === 0) return;
  const res = nodes.shift();
  helper(nodes, 0);
  return res;
}
function add(nodes, e) {
  nodes.unshift(e);
  helper(nodes, 0);
}
function contains(nodes, e) {
  for (let node of nodes) {
    if (node.num === e.num) return true;
  }
  return false;
}
function remove(nodes, e) {
  if (contains(nodes, e)) {
    let idx = nodes.findIndex((elm) => elm.num === e.num);
    nodes.splice(idx, 1);
    heapify(nodes);
    return true;
  }
  return false;
}
