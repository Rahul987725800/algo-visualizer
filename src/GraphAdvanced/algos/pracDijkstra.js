const nodes = [
  {
    num: 1,
    originatingEdges: [],
    terminatingEdges: [],
  },
];
const edges = [
  {
    id: 1,
    startNode: 1,
    endNode: 2,
    length: 89,
    directed: false,
  },
  {
    id: 2,
    startNode: 1,
    endNode: 3,
    length: 32,
    directed: false,
  },
  {
    id: 3,
    startNode: 3,
    endNode: 4,
    length: 10,
    directed: false,
  },
  {
    id: 4,
    startNode: 2,
    endNode: 5,
    length: 67,
    directed: false,
  },
  {
    id: 5,
    startNode: 2,
    endNode: 4,
    length: 200,
    directed: false,
  },
  {
    id: 6,
    startNode: 4,
    endNode: 6,
    length: 300,
    directed: false,
  },
  {
    id: 7,
    startNode: 6,
    endNode: 7,
    length: 150,
    directed: false,
  },
  {
    id: 8,
    startNode: 6,
    endNode: 9,
    length: 212,
    directed: false,
  },
  {
    id: 9,
    startNode: 5,
    endNode: 8,
    length: 12,
    directed: false,
  },
  {
    id: 10,
    startNode: 8,
    endNode: 7,
    length: 75,
    directed: false,
  },
];
for (let edge of edges) {
  const reversedEdge = { ...edge };
  reversedEdge.startNode = edge.endNode;
  reversedEdge.endNode = edge.startNode;
  let startNode = nodes.find((node) => node.num === edge.startNode);
  if (startNode) {
    startNode.originatingEdges.push({ ...edge });
    startNode.terminatingEdges.push({ ...reversedEdge });
    startNode.distance = Number.MAX_VALUE;
  } else {
    startNode = {
      num: edge.startNode,
      originatingEdges: [{ ...edge }],
      terminatingEdges: [{ ...reversedEdge }],
      distance: Number.MAX_VALUE,
    };
    nodes.push(startNode);
  }
  let endNode = nodes.find((node) => node.num === edge.endNode);

  if (endNode) {
    endNode.terminatingEdges.push({ ...edge });
    endNode.originatingEdges.push({ ...reversedEdge });
    endNode.distance = Number.MAX_VALUE;
  } else {
    endNode = {
      num: edge.endNode,
      originatingEdges: [{ ...reversedEdge }],
      terminatingEdges: [{ ...edge }],
      distance: Number.MAX_VALUE,
    };
    nodes.push(endNode);
  }
}

const sortedEdges = edges.sort((e1, e2) => e1.length - e2.length);
// console.log(sortedEdges);
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
function dijkstra(source, destination, nodes) {
  const sourceNode = nodes.find((node) => node.num === source);
  sourceNode.distance = 0;
  const nodesHeap = [];
  add(nodesHeap, sourceNode);
  const visited = {};
  for (let node of nodes) {
    visited[node.num] = false;
  }
  while (nodesHeap.length !== 0) {
    let tempNode = pop(nodesHeap);
    visited[tempNode.num] = true;
    if (tempNode.num === destination) return tempNode;
    tempNode.originatingEdges = tempNode.originatingEdges.sort(
      (e1, e2) => e1.length - e2.length,
    );

    for (let edge of tempNode.originatingEdges) {
      if (!visited[edge.endNode]) {
        let targetNode = nodes.find((node) => node.num === edge.endNode);
        if (tempNode.distance + edge.length < targetNode.distance) {
          remove(nodesHeap, targetNode);
          targetNode.distance = tempNode.distance + edge.length;
          targetNode.predecessor = tempNode;
          add(nodesHeap, targetNode);
        }
      }
    }
  }
  return Number.MAX_VALUE;
}
const destinationNode = dijkstra(1, 8, nodes);
let tempNode = destinationNode;
console.log(tempNode.distance);
while (tempNode) {
  console.log(tempNode.num);
  tempNode = tempNode.predecessor;
}
