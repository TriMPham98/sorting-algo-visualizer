import { SortGenerator, SortStep } from './types';

export function* insertionSort(array: number[]): SortGenerator {
  const arr = [...array];
  const n = arr.length;

  yield { action: 'sorted', indices: [0] } as SortStep;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    yield { action: 'compare', indices: [i, j] } as SortStep;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      yield { action: 'set', indices: [j + 1], values: [arr[j]] } as SortStep;

      j--;
      if (j >= 0) {
        yield { action: 'compare', indices: [j + 1, j] } as SortStep;
      }
    }

    arr[j + 1] = key;
    yield { action: 'set', indices: [j + 1], values: [key] } as SortStep;
    yield { action: 'sorted', indices: [i] } as SortStep;
  }
}
