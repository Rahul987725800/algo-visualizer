const point = (i, j) => {
  return {
    i,
    j,
  };
};
const pointEq = (p1, p2) => {
  return p1.i === p2.i && p1.j === p2.j;
};

const breathFirstSearch = (rows, cols, source, destination) => {
  const visited = [];
  for (let i = 0; i < rows; i++) {
    visited.push(Array(cols).fill(false));
  }
  const queue = [];
  queue.push([{ ...source }]);
  visited[source.i][source.j] = true;
  while (queue.length !== 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    if (pointEq(current, destination)) return path;
    if (current.i - 1 >= 0 && !visited[current.i - 1][current.j]) {
      queue.push([...path, point(current.i - 1, current.j)]);
      visited[current.i - 1][current.j] = true;
    }
    if (current.i + 1 < rows && !visited[current.i + 1][current.j]) {
      queue.push([...path, point(current.i + 1, current.j)]);
      visited[current.i + 1][current.j] = true;
    }
    if (current.j - 1 >= 0 && !visited[current.i][current.j - 1]) {
      queue.push([...path, point(current.i, current.j - 1)]);
      visited[current.i][current.j - 1] = true;
    }
    if (current.j + 1 < cols && !visited[current.i][current.j + 1]) {
      queue.push([...path, point(current.i, current.j + 1)]);
      visited[current.i][current.j + 1] = true;
    }
  }
};
// let rows = 10;
// let cols = 10;
// let source = point(0, 0);
// let destination = point(6, 7);
// for (let node of breathFirstSearch(rows, cols, source, destination)) {
//   console.log(node);
// }
const deapthFirstSearch = (rows, cols, source, destination) => {
  const visited = [];
  for (let i = 0; i < rows; i++) {
    visited.push(Array(cols).fill(false));
  }
  visited[source.i][source.j] = true;
  return helper(rows, cols, source, destination, visited);
};
const checker = (rows, cols, current, destination, visited, next) => {
  visited[next.i][next.j] = true;
  const path = helper(rows, cols, next, destination, visited);
  if (path.length) {
    path.unshift(current);
    return path;
  }
  return [];
};
const helper = (rows, cols, current, destination, visited) => {
  if (pointEq(destination, current)) return [current];
  if (current.i - 1 >= 0 && !visited[current.i - 1][current.j]) {
    const next = point(current.i - 1, current.j);
    const path = checker(rows, cols, current, destination, visited, next);
    if (path.length) return path;
  }
  if (current.i + 1 < rows && !visited[current.i + 1][current.j]) {
    const next = point(current.i + 1, current.j);
    const path = checker(rows, cols, current, destination, visited, next);
    if (path.length) return path;
  }
  if (current.j - 1 >= 0 && !visited[current.i][current.j - 1]) {
    const next = point(current.i, current.j - 1);
    const path = checker(rows, cols, current, destination, visited, next);
    if (path.length) return path;
  }
  if (current.j + 1 < cols && !visited[current.i][current.j + 1]) {
    const next = point(current.i, current.j + 1);
    const path = checker(rows, cols, current, destination, visited, next);
    if (path.length) return path;
  }
  return [];
};
let rows = 5;
let cols = 5;
let source = point(0, 0);
let destination = point(4, 5);
for (let node of deapthFirstSearch(rows, cols, source, destination)) {
  console.log(node);
}
