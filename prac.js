function bubbleSort(arr, e) {
  let n = arr.length;
  let l = 0;
  let h = n - 1;
  while (l <= h) {
    let m = Math.floor((l + h) / 2);
    if (arr[m] === e) {
      return true;
    } else if (e < arr[m]) {
      h = m - 1;
    } else {
      l = m + 1;
    }
  }
  return false;
}
arr = [1, 2, 3, 4, 5];
console.log(bubbleSort(arr, 0));
console.log(bubbleSort(arr, 1));
console.log(bubbleSort(arr, 2));
console.log(bubbleSort(arr, 3));
console.log(bubbleSort(arr, 4));
console.log(bubbleSort(arr, 5));
console.log(bubbleSort(arr, 6));
