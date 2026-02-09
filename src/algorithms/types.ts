export type SortAction = 'compare' | 'swap' | 'set' | 'sorted';

export interface SortStep {
  action: SortAction;
  indices: number[];
  values?: number[];
}

export type SortGenerator = Generator<SortStep, void, unknown>;

export type SortAlgorithm = (array: number[]) => SortGenerator;
