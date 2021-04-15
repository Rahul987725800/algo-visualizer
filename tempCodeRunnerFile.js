function bubbleSort(arr, e) {
  let n = arr.length;
  let i = 0;
  let j = n - 1;
  while (i <= j) {
    let m = (i + j) / 2;
    if (arr[m] === e) {
      return true;
    }
  }
  return false;
}
arr = [1, 2, 3, 4, 5];
console.log(bubbleSort(arr, 3));
