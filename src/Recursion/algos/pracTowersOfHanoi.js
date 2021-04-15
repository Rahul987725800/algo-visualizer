const helper = (n, a, b, c) => {
  if (n === 0) return;
  helper(n - 1, a, c, b);
  console.log(`Moved ${n} from ${a} to ${b}`);
  helper(n - 1, c, b, a);
};
const towersOfHanoi = (n) => {
  helper(n, 'A', 'B', 'C');
};
towersOfHanoi(3);
