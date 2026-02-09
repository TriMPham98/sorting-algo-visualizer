import { SortGenerator, SortStep } from './types';

export function* quickSort(array: number[]): SortGenerator {
  const arr = [...array];
  yield* quickSortHelper(arr, 0, arr.length - 1);

  for (let i = 0; i < arr.length; i++) {
    yield { action: 'sorted', indices: [i] } as SortStep;
  }
}

function* quickSortHelper(
  arr: number[],
  low: number,
  high: number
): SortGenerator {
  if (low >= high) return;

  const pivotIndex: number = yield* partition(arr, low, high);
  yield* quickSortHelper(arr, low, pivotIndex - 1);
  yield* quickSortHelper(arr, pivotIndex + 1, high);
}

function* partition(
  arr: number[],
  low: number,
  high: number
): Generator<SortStep, number, unknown> {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    yield { action: 'compare', indices: [j, high] } as SortStep;

    if (arr[j] < pivot) {
      i++;
      if (i !== j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield { action: 'swap', indices: [i, j] } as SortStep;
      }
    }
  }

  const pivotFinalIndex = i + 1;
  if (pivotFinalIndex !== high) {
    [arr[pivotFinalIndex], arr[high]] = [arr[high], arr[pivotFinalIndex]];
    yield { action: 'swap', indices: [pivotFinalIndex, high] } as SortStep;
  }

  return pivotFinalIndex;
}
