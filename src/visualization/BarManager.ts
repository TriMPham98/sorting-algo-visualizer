import * as THREE from 'three';
import { Bar, BarState } from './Bar';
import { Scene } from '../core/Scene';

export class BarManager {
  private scene: Scene;
  private bars: Bar[] = [];
  private barWidth = 0.8;
  private barGap = 0.2;
  private maxHeight = 20;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  public generateBars(count: number): number[] {
    this.clearBars();

    const values: number[] = [];
    for (let i = 0; i < count; i++) {
      values.push(Math.floor(Math.random() * this.maxHeight) + 1);
    }

    const totalWidth = count * (this.barWidth + this.barGap) - this.barGap;
    const startX = -totalWidth / 2 + this.barWidth / 2;

    for (let i = 0; i < count; i++) {
      const x = startX + i * (this.barWidth + this.barGap);
      const position = new THREE.Vector3(x, 0, 0);
      const bar = new Bar(values[i], position);
      bar.mesh.scale.x = this.barWidth;
      bar.mesh.scale.z = this.barWidth;
      this.bars.push(bar);
      this.scene.add(bar.mesh);
    }

    return values;
  }

  public getValues(): number[] {
    return this.bars.map((bar) => bar.value);
  }

  public setValues(values: number[]): void {
    for (let i = 0; i < this.bars.length && i < values.length; i++) {
      this.bars[i].updateHeight(values[i]);
    }
  }

  public highlightBars(indices: number[], state: BarState): void {
    for (const index of indices) {
      if (index >= 0 && index < this.bars.length) {
        this.bars[index].setState(state);
      }
    }
  }

  public resetHighlights(): void {
    for (const bar of this.bars) {
      if (bar.getState() !== BarState.Sorted) {
        bar.setState(BarState.Default);
      }
    }
  }

  public resetAllToDefault(): void {
    for (const bar of this.bars) {
      bar.setState(BarState.Default);
    }
  }

  public swapBars(i: number, j: number): void {
    if (i < 0 || i >= this.bars.length || j < 0 || j >= this.bars.length) {
      return;
    }

    const tempValue = this.bars[i].value;
    this.bars[i].updateHeight(this.bars[j].value);
    this.bars[j].updateHeight(tempValue);
  }

  public setBarValue(index: number, value: number): void {
    if (index >= 0 && index < this.bars.length) {
      this.bars[index].updateHeight(value);
    }
  }

  public getBarValue(index: number): number {
    if (index >= 0 && index < this.bars.length) {
      return this.bars[index].value;
    }
    return 0;
  }

  public markAsSorted(indices: number[]): void {
    for (const index of indices) {
      if (index >= 0 && index < this.bars.length) {
        this.bars[index].setState(BarState.Sorted);
      }
    }
  }

  public markAllAsSorted(): void {
    for (const bar of this.bars) {
      bar.setState(BarState.Sorted);
    }
  }

  public getBarCount(): number {
    return this.bars.length;
  }

  private clearBars(): void {
    for (const bar of this.bars) {
      this.scene.remove(bar.mesh);
      bar.dispose();
    }
    this.bars = [];
  }

  public dispose(): void {
    this.clearBars();
  }
}
