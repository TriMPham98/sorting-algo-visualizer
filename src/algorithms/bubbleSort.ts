import { SortGenerator, SortStep } from './types';

export function* bubbleSort(array: number[]): SortGenerator {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { action: 'compare', indices: [j, j + 1] } as SortStep;

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { action: 'swap', indices: [j, j + 1] } as SortStep;
      }
    }
    yield { action: 'sorted', indices: [n - i - 1] } as SortStep;
  }
  yield { action: 'sorted', indices: [0] } as SortStep;
}
