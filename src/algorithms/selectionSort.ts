import { SortGenerator, SortStep } from './types';

export function* selectionSort(array: number[]): SortGenerator {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      yield { action: 'compare', indices: [minIndex, j] } as SortStep;

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      yield { action: 'swap', indices: [i, minIndex] } as SortStep;
    }

    yield { action: 'sorted', indices: [i] } as SortStep;
  }

  yield { action: 'sorted', indices: [n - 1] } as SortStep;
}
