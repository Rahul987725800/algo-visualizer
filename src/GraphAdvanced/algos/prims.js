import { Timer } from '../../utils';
export function prims(nodes, edges, visualizerState, setVisualizerState) {
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
  let nVertices = nodes.length;
  let nEdgesToBeSelected = nVertices - 1;
  let cost = {};
  for (let node of nodes) {
    for (let n of nodes) {
      cost[node.num] = { ...cost[node.num] };
      cost[node.num][n.num] = Number.MAX_VALUE;
    }
  }
  for (let node of nodes) {
    for (let edge of node.originatingEdges) {
      cost[node.num] = { ...cost[node.num] };
      cost[node.num][edge.endNode] = edge.length;
    }
  }
  let i, j, minLengthEdge, k;
  let near = {};
  let selectedEdges = [];
  let min = Number.MAX_VALUE;
  for (let edge of edges) {
    if (edge.length < min) {
      min = edge.length;
      i = edge.startNode;
      j = edge.endNode;
      minLengthEdge = edge;
    }
  }
  selectedEdges.push(minLengthEdge);
  near[i] = 0;
  near[j] = 0;
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          edgesFinalized: { ...vs.edgesFinalized, [minLengthEdge.id]: true },
          nodesFinalized: { ...vs.nodesFinalized, [i]: true, [j]: true },
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );
  for (let node of nodes) {
    if (near[node.num] !== 0) {
      if (cost[node.num][i] < cost[node.num][j]) {
        near[node.num] = i;
      } else {
        near[node.num] = j;
      }
    }
  }
  while (selectedEdges.length < nEdgesToBeSelected) {
    min = Number.MAX_VALUE;
    for (let node of nodes) {
      if (near[node.num] !== 0 && cost[node.num][near[node.num]] < min) {
        k = node.num;
        min = cost[node.num][near[node.num]];
      }
    }
    const selectedEdge = edges.find(
      (edge) =>
        (edge.startNode === k && edge.endNode === near[k]) ||
        (edge.endNode === k && edge.startNode === near[k]),
    );
    if (!selectedEdge) break;
    near[k] = 0;
    selectedEdges.push(selectedEdge);
    const kc = k;

    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            edgesFinalized: { ...vs.edgesFinalized, [selectedEdge.id]: true },
            nodesFinalized: { ...vs.nodesFinalized, [kc]: true },
            active: selectedEdges.length === nEdgesToBeSelected ? true : false,
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
    for (let node of nodes) {
      if (
        near[node.num] !== 0 &&
        cost[node.num][k] < cost[node.num][near[node.num]]
      ) {
        near[node.num] = k;
      }
    }
  }
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
  return selectedEdges;
}
