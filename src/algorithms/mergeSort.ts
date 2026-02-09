import { SortGenerator, SortStep } from './types';

export function* mergeSort(array: number[]): SortGenerator {
  const arr = [...array];
  yield* mergeSortHelper(arr, 0, arr.length - 1);

  for (let i = 0; i < arr.length; i++) {
    yield { action: 'sorted', indices: [i] } as SortStep;
  }
}

function* mergeSortHelper(
  arr: number[],
  left: number,
  right: number
): SortGenerator {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  yield* mergeSortHelper(arr, left, mid);
  yield* mergeSortHelper(arr, mid + 1, right);
  yield* merge(arr, left, mid, right);
}

function* merge(
  arr: number[],
  left: number,
  mid: number,
  right: number
): SortGenerator {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);

  let i = 0;
  let j = 0;
  let k = left;

  while (i < leftArr.length && j < rightArr.length) {
    yield {
      action: 'compare',
      indices: [left + i, mid + 1 + j],
    } as SortStep;

    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      yield { action: 'set', indices: [k], values: [leftArr[i]] } as SortStep;
      i++;
    } else {
      arr[k] = rightArr[j];
      yield { action: 'set', indices: [k], values: [rightArr[j]] } as SortStep;
      j++;
    }
    k++;
  }

  while (i < leftArr.length) {
    arr[k] = leftArr[i];
    yield { action: 'set', indices: [k], values: [leftArr[i]] } as SortStep;
    i++;
    k++;
  }

  while (j < rightArr.length) {
    arr[k] = rightArr[j];
    yield { action: 'set', indices: [k], values: [rightArr[j]] } as SortStep;
    j++;
    k++;
  }
}
