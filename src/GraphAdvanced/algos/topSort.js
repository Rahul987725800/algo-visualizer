import { Timer } from '../../utils';
export function topSortAlgo(
  source,
  nodes,
  edges,
  visualizerState,
  setVisualizerState,
) {
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
  let sortedNodes = topSort(nodes);
  let distance = {};
  let predecessor = {};
  for (let node of nodes) {
    distance[node.num] = Number.MAX_VALUE;
  }
  distance[source] = 0;
  predecessor[source] = {
    node: null,
    edge: null,
  };
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          dijkstraDistanceNodes: {
            ...vs.dijkstraDistanceNodes,
            [source]: 0,
          },
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );
  for (let node of sortedNodes) {
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            nodesVisited: { ...vs.nodesVisited, [node.num]: true },
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
    for (let edge of node.originatingEdges) {
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
      if (distance[node.num] + edge.length < distance[edge.endNode]) {
        distance[edge.endNode] = distance[node.num] + edge.length;
        predecessor[edge.endNode] = {
          node,
          edge,
        };
        const dist = distance[edge.endNode];
        timeOuts.push(
          new Timer(() => {
            setVisualizerState((vs) => {
              return {
                ...vs,
                dijkstraDistanceNodes: {
                  ...vs.dijkstraDistanceNodes,
                  [edge.endNode]: dist,
                },
              };
            });
          }, visualizerState.delay * timeOuts.length),
        );
      }
    }
  }
  for (let nodeNum in predecessor) {
    showTrack(
      nodeNum,
      predecessor,
      visualizerState,
      setVisualizerState,
      timeOuts,
    );
  }
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
  return distance;
}
function showTrack(
  nodeNum,
  predecessor,
  visualizerState,
  setVisualizerState,
  timeOuts,
) {
  const nodeNumC = nodeNum;
  timeOuts.push(
    new Timer(() => {
      setVisualizerState((vs) => {
        return {
          ...vs,
          nodesFinalized: { ...vs.nodesFinalized, [nodeNumC]: true },
        };
      });
    }, visualizerState.delay * timeOuts.length),
  );
  while (true) {
    const { node, edge } = predecessor[nodeNum];
    if (!node || !edge || edge.visited) break;
    edge.visited = true;
    timeOuts.push(
      new Timer(() => {
        setVisualizerState((vs) => {
          return {
            ...vs,
            edgesFinalized: { ...vs.edgesFinalized, [edge.id]: true },
            nodesFinalized: { ...vs.nodesFinalized, [node.num]: true },
          };
        });
      }, visualizerState.delay * timeOuts.length),
    );
    nodeNum = node.num;
  }
}
function topSort(nodes) {
  console.log(nodes);
  let visited = {};
  let stack = [];
  for (let node of nodes) {
    topSortHelper(visited, stack, node, nodes);
  }
  let sorted = [];
  while (stack.length !== 0) {
    sorted.push(stack.pop());
  }
  return sorted;
}
function topSortHelper(visited, stack, sourceNode, nodes) {
  if (!visited[sourceNode.num]) {
    visited[sourceNode.num] = true;
    for (let edge of sourceNode.originatingEdges) {
      topSortHelper(
        visited,
        stack,
        nodes.find((node) => node.num === edge.endNode),
        nodes,
      );
    }
    stack.push(sourceNode);
  }
}
