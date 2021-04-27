// just source needed
import { Timer } from '../../utils';
import { pop, add, remove, showTrack } from './dijkstraCommon';
export function dijkstraAllNodes(
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
    // if (tempNode.num === destination) {
    //   showTrack(tempNode, visualizerState, setVisualizerState, timeOuts);
    //   setVisualizerState((vs) => ({ ...vs, timeOuts }));
    //   return tempNode.distance;
    // }
    const sortedEdges = tempNode.originatingEdges
      .map((edge) => ({ ...edge }))
      .sort((e1, e2) => e1.length - e2.length);
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
  for (let node of nodes) {
    showTrack(node, visualizerState, setVisualizerState, timeOuts);
  }
  setVisualizerState((vs) => ({ ...vs, timeOuts }));
  return Number.MAX_VALUE;
}
