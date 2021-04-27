function sample() {
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
  return { nodes, edges };
}

function prims(nodes, edges) {
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
    near[k] = 0;
    selectedEdges.push(selectedEdge);
    for (let node of nodes) {
      if (
        near[node.num] !== 0 &&
        cost[node.num][k] < cost[node.num][near[node.num]]
      ) {
        near[node.num] = k;
      }
    }
  }
  return selectedEdges;
}
const { nodes, edges } = sample();
console.log(prims(nodes, edges));
