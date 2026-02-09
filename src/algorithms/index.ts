import { SortAlgorithm } from './types';
import { bubbleSort } from './bubbleSort';
import { selectionSort } from './selectionSort';
import { insertionSort } from './insertionSort';
import { mergeSort } from './mergeSort';
import { quickSort } from './quickSort';

export const algorithms: Record<string, SortAlgorithm> = {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
};

export * from './types';
