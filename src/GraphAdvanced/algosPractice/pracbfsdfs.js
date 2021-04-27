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

const bfs = (source, destination, nodes) => {
  const sourceNode = nodes.find((node) => node.num === source);
  const visited = {};
  for (let node of nodes) {
    visited[node.num] = false;
  }
  const queue = [];
  queue.push([sourceNode]);
  visited[sourceNode.num] = true;

  while (queue.length !== 0) {
    const path = queue.shift();
    const tempNode = path[path.length - 1];
    if (tempNode.num === destination) return path;
    if (tempNode.num === destination) return true;
    for (let edge of tempNode.originatingEdges) {
      if (!visited[edge.endNode]) {
        queue.push([...path, nodes.find((node) => node.num === edge.endNode)]);
        visited[edge.endNode] = true;
      }
    }
  }
};
// const path = bfs(9, 8, nodes);
// console.log(path);
const dfs = (source, destinaiton, nodes) => {
  const sourceNode = nodes.find((node) => node.num === source);
  const destinationNode = nodes.find((node) => node.num === destinaiton);
  const visited = {};
  for (let node of nodes) {
    visited[node.num] = false;
  }
  return helper(sourceNode, destinationNode, nodes, visited);
};

function helper(sourceNode, destinationNode, nodes, visited) {
  visited[sourceNode.num] = true;
  if (sourceNode.num === destinationNode.num) return [sourceNode];
  for (let edge of sourceNode.originatingEdges) {
    if (!visited[edge.endNode]) {
      const nextNode = nodes.find((node) => node.num === edge.endNode);
      const pathRem = helper(nextNode, destinationNode, nodes, visited);
      if (pathRem.length) return [sourceNode, ...pathRem];
    }
  }
  return [];
}
const { nodes } = sample();
const path = dfs(1, 3, nodes);
console.log(path);
