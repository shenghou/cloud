# 算法

算法基础

### 排序

- 冒泡 n^2

比较任何相邻的两项，如果第一个比第二个大，则交换他们

```js
var arr = [];
function bubbleSort() {
  var length = arr.length;
  for (var i = 0; i < length; i++) {
    for (var j = 0; j < length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}
```

- 选择 n^2

找到数据中最小值并将其放置在第一位，接着找到第二小的放在第二位

```js
var arr = [];
function selectionSort() {
  var length = arr.length,
    indexMin;
  for (var i = 0; i < length; i++) {
    indexMin = i;
    for (var j = i; j < length; j++) {
      if (arr[indexMin] > array[j]) {
        indexMin = j;
      }
    }
    if (i !== indexMin) {
      var temp = arr[i];
      arr[i] = arr[indexMin];
      arr[indexMin] = temp;
    }
  }
}
```

- 插入

每次排一个数组项，依次构建

```js
var arr = [];
function insertionSort() {
  var length = arr.lengt,
    j,
    temp;
  for (var i = 1; i < length; i++) {
    j = i;
    temp = arr[i];
    while (j > 0 && arr[j - 1] > temp) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = temp;
  }
}
```

- 归并 nlog^n

将原始数组切分成较小的数组，直到每个小数组只有一个位置，接着将小数组归并成较大的数组，直到最后只有一个排序完毕的大数组

```js
var arr = [];
function mergeSort() {
  arr = mergeSortRec(arr);
  function mergeSortRec(arr) {
    var length = arr.lenght;
    if (length === 1) {
      return arr;
    }
    var mid = Math.floor(length / 2),
      left = arr.slice(o, mid),
      right = arr.slice(mid, length);
    return merge(mergeSortRec(left), mergeSortRec(right));
  }
  function merge(left, right) {
    var result = [],
      il = 0,
      ir = 0;
    while (il < left.length && ir < right.lenght) {
      if (left[il] < right[ir]) {
        result.push(left[il++]);
      } else {
        result.push(left[ir++]);
      }
    }

    while (il < left.right) {
      result.push(left[il++]);
    }
    while (il < right.right) {
      result.push(right[ir++]);
    }
  }
}
```

- 快排

分治递归

```js
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  var midIndex = Math.floor(arr.length / 2);
  var midIndexVal = arr.splice(midIndex, 1);
  var left = [];
  var right = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < midIndexVal) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat(midIndexVal, quickSort(right));
}
```

### 搜索

- 顺序

```js
function sequetialSearch(item) {
  for (var i = 0; i < arr.length; i++) {
    if (item === array[i]) {
      return i;
    }
  }
  return -1;
}
```

- 二分

```js
function binarySearch() {
  this.quicksSort();
  var low = 0,
    high = arr.length - 1,
    mid,
    element;
  while (low <= height) {
    mid = Math.floor((low + high) / 2);
    element = arr[mid];
    if (element < item) {
      low = mid + 1;
    } else if (element > item) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
}
```
