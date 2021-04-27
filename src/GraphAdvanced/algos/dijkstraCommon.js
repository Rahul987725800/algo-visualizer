import { Timer } from '../../utils';
export function showTrack(
  destinationNode,
  visualizerState,
  setVisualizerState,
  timeOuts,
) {
  let tempNode = destinationNode;
  while (tempNode.predecessor) {
    const num = tempNode.num;
    const edge = tempNode.predecessor.edge;
    if (!tempNode.visited || !edge.visited) {
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
      tempNode.visited = true;
      edge.visited = true;
    }

    tempNode = tempNode.predecessor.node;
  }
  if (!tempNode.visited) {
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
    tempNode.visited = true;
  }
}

export const helper = (nodes, i) => {
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
export const heapify = (nodes) => {
  const n = nodes.length;
  for (let i = Math.floor(n / 2); i >= 0; i--) {
    helper(nodes, i);
  }
};
export function pop(nodes) {
  if (nodes.length === 0) return;
  const res = nodes.shift();
  helper(nodes, 0);
  return res;
}
export function add(nodes, e) {
  nodes.unshift(e);
  helper(nodes, 0);
}
export function contains(nodes, e) {
  for (let node of nodes) {
    if (node.num === e.num) return true;
  }
  return false;
}
export function remove(nodes, e) {
  if (contains(nodes, e)) {
    let idx = nodes.findIndex((elm) => elm.num === e.num);
    nodes.splice(idx, 1);
    heapify(nodes);
    return true;
  }
  return false;
}
