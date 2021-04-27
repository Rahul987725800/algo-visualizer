import { Timer } from '../../utils';
export function kruskals(nodes, edges, visualizerState, setVisualizerState) {
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
  const nVertices = nodes.length;
  let nEdgesToBeSelected = nVertices - 1;
  const sortedEdges = edges
    .map((edge) => ({ ...edge }))
    .sort((e1, e2) => e1.length - e2.length);
  let parent = {};
  let rank = {};
  for (let node of nodes) {
    parent[node.num] = node.num;
    rank[node.num] = 1;
  }
  let totalWeight = 0;
  let selectedEdges = [];
  for (let edge of sortedEdges) {
    let px = find(edge.startNode, parent);
    let py = find(edge.endNode, parent);
    if (px !== py) {
      // graph is not forming cycles
      selectedEdges.push(edge);
      totalWeight += edge.length;
      union(px, py, parent, rank);
      timeOuts.push(
        new Timer(() => {
          setVisualizerState((vs) => {
            return {
              ...vs,
              edgesFinalized: { ...vs.edgesFinalized, [edge.id]: true },
              nodesFinalized: {
                ...vs.nodesFinalized,
                [edge.startNode]: true,
                [edge.endNode]: true,
              },
            };
          });
        }, visualizerState.delay * timeOuts.length),
      );
    }
  }
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
  return selectedEdges;
}
function union(x, y, parent, rank) {
  if (rank[x] > rank[y]) {
    parent[y] = x;
    rank[x] += rank[y];
  } else {
    parent[x] = y;
    rank[y] += rank[x];
  }
}
function find(x, parent) {
  let t = x;
  while (t !== parent[t]) {
    t = parent[t];
  }
  while (x !== parent[x]) {
    let temp = parent[x];
    parent[x] = t;
    x = temp;
  }
  return t;
}
