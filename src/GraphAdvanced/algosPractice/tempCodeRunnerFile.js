function kruskals(nodes, edges) {
  const nVertices = nodes.length;
  let nEdgesToBeSelected = nVertices - 1;
  const sortedEdges = edges.sort((e1, e2) => e1.length - e2.length);
  let parent = {};
  let rank = {};
  for (let node of nodes) {
    parent[node.num] = node.num;
    rank[node.num] = 0;
  }
  let totalWeight = 0;
  let selectedEdges = [];
  for (let edge of edges) {
    if (parent[edge.startNode] !== parent[edge.endNode]) {
      // graph is not forming cycles
      selectedEdges.push(edge);
      totalWeight += edge.length;
      union(edge.startNode, edge.endNode, parent, rank);
      if (selectedEdges.length === nEdgesToBeSelected) break;
    }
  }
  return selectedEdges;
}
function union(x, y, parent, rank) {
  if (rank[parent[y]] > rank[parent[x]]) {
    parent[x] = parent[y];
    rank[parent[y]]++;
  } else {
    parent[y] = parent[x];
    rank[parent[x]]++;
  }
}
const { nodes, edges } = sample();
const selectedEdges = kruskals(nodes, edges);
console.log(selectedEdges);
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
