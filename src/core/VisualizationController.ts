import { BarManager } from '../visualization/BarManager';
import { BarState } from '../visualization/Bar';
import { algorithms, SortGenerator, SortStep } from '../algorithms';
import { SoundEffects } from '../audio/SoundEffects';

export type ControllerState = 'idle' | 'running' | 'paused' | 'completed';

export class VisualizationController {
  private barManager: BarManager;
  private soundEffects: SoundEffects;
  private currentAlgorithm = 'bubbleSort';
  private arraySize = 30;
  private speed = 50;
  private state: ControllerState = 'idle';
  private generator: SortGenerator | null = null;
  private currentArray: number[] = [];
  private timeoutId: number | null = null;
  private onStateChange: ((state: ControllerState) => void) | null = null;

  constructor(barManager: BarManager, soundEffects: SoundEffects) {
    this.barManager = barManager;
    this.soundEffects = soundEffects;
  }

  public setStateChangeCallback(callback: (state: ControllerState) => void): void {
    this.onStateChange = callback;
  }

  public setAlgorithm(algorithm: string): void {
    this.currentAlgorithm = algorithm;
  }

  public setArraySize(size: number): void {
    this.arraySize = size;
    if (this.state === 'idle' || this.state === 'completed') {
      this.reset();
    }
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public initialize(): void {
    this.currentArray = this.barManager.generateBars(this.arraySize);
    this.state = 'idle';
    this.notifyStateChange();
  }

  public reset(): void {
    this.stop();
    this.barManager.resetAllToDefault();
    this.currentArray = this.barManager.generateBars(this.arraySize);
    this.generator = null;
    this.state = 'idle';
    this.notifyStateChange();
  }

  public play(): void {
    if (this.state === 'running') return;

    if (this.state === 'idle' || this.state === 'completed') {
      this.barManager.resetAllToDefault();
      this.currentArray = this.barManager.getValues();
      const algorithm = algorithms[this.currentAlgorithm];
      this.generator = algorithm(this.currentArray);
    }

    this.state = 'running';
    this.notifyStateChange();
    this.processNextStep();
  }

  public pause(): void {
    if (this.state !== 'running') return;

    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.state = 'paused';
    this.notifyStateChange();
  }

  public stop(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.state = 'idle';
    this.notifyStateChange();
  }

  public getState(): ControllerState {
    return this.state;
  }

  private processNextStep(): void {
    if (this.state !== 'running' || !this.generator) return;

    const result = this.generator.next();

    if (result.done) {
      this.barManager.markAllAsSorted();
      this.soundEffects.playCompletion(this.arraySize);
      this.state = 'completed';
      this.notifyStateChange();
      return;
    }

    const step = result.value as SortStep;
    this.executeStep(step);

    this.timeoutId = window.setTimeout(() => {
      this.barManager.resetHighlights();
      this.processNextStep();
    }, this.speed);
  }

  private executeStep(step: SortStep): void {
    switch (step.action) {
      case 'compare':
        this.barManager.highlightBars(step.indices, BarState.Comparing);
        this.soundEffects.playCompare(
          this.barManager.getBarValue(step.indices[0]),
          this.barManager.getBarValue(step.indices[1])
        );
        break;

      case 'swap':
        this.barManager.highlightBars(step.indices, BarState.Swapping);
        this.barManager.swapBars(step.indices[0], step.indices[1]);
        this.soundEffects.playSwap(
          this.barManager.getBarValue(step.indices[0]),
          this.barManager.getBarValue(step.indices[1])
        );
        break;

      case 'set':
        if (step.values && step.values.length > 0) {
          this.barManager.setBarValue(step.indices[0], step.values[0]);
          this.barManager.highlightBars(step.indices, BarState.Swapping);
          this.soundEffects.playSet(step.values[0]);
        }
        break;

      case 'sorted':
        this.barManager.markAsSorted(step.indices);
        if (step.indices.length > 0) {
          this.soundEffects.playSorted(this.barManager.getBarValue(step.indices[0]));
        }
        break;
    }
  }

  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }
}
