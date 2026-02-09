import * as THREE from 'three';

type UpdateCallback = (deltaTime: number) => void;

export class AnimationLoop {
  private clock: THREE.Clock;
  private updateCallbacks: UpdateCallback[] = [];
  private renderCallback: (() => void) | null = null;
  private isRunning = false;
  private animationFrameId: number | null = null;

  constructor() {
    this.clock = new THREE.Clock();
  }

  public onUpdate(callback: UpdateCallback): void {
    this.updateCallbacks.push(callback);
  }

  public onRender(callback: () => void): void {
    this.renderCallback = callback;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.loop();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop = (): void => {
    if (!this.isRunning) return;

    const deltaTime = this.clock.getDelta();

    for (const callback of this.updateCallbacks) {
      callback(deltaTime);
    }

    if (this.renderCallback) {
      this.renderCallback();
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}
