const helper = (arr, i) => {
  const n = arr.length;
  let l = i * 2 + 1;
  let r = i * 2 + 2;
  let minI = i;
  if (l < n && arr[l] < arr[minI]) {
    minI = l;
  }
  if (r < n && arr[r] < arr[minI]) {
    minI = r;
  }
  if (minI !== i) {
    [arr[i], arr[minI]] = [arr[minI], arr[i]];
    helper(arr, minI);
  }
};
const heapify = (arr) => {
  const n = arr.length;
  for (let i = Math.floor(n / 2); i >= 0; i--) {
    helper(arr, i);
  }
};
const arr = [8, 7, 6, 5, 4, 3, 2, 1];
heapify(arr);
console.log(arr);
function pop(arr) {
  if (arr.length === 0) return;
  const res = arr.shift();
  helper(arr, 0);
  return res;
}
function add(arr, e) {
  arr.unshift(e);
  helper(arr, 0);
}
function contains(arr, e) {
  if (arr.includes(e)) return true;
  return false;
}
function remove(arr, e) {
  if (contains(arr, e)) {
    let idx = arr.findIndex((elm) => elm === e);
    arr.splice(idx, 1);
    heapify(arr);
    return true;
  }
  return false;
}
remove(arr, 4);
add(arr, 9);
console.log(pop(arr));
console.log(pop(arr));
console.log(pop(arr));
console.log(pop(arr));
console.log(pop(arr));
console.log(pop(arr));
add(arr, 10);
console.log(pop(arr));
console.log(pop(arr));
console.log(pop(arr));
console.log(pop(arr));
add(arr, 11);
console.log(pop(arr));
console.log(pop(arr));
