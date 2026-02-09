export class AudioManager {
  private context: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private isEnabled = true;

  public async initialize(): Promise<void> {
    if (this.context) return;

    this.context = new AudioContext();
    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = 0.3;
    this.gainNode.connect(this.context.destination);
  }

  public async resume(): Promise<void> {
    if (this.context?.state === 'suspended') {
      await this.context.resume();
    }
  }

  public getContext(): AudioContext | null {
    return this.context;
  }

  public getGainNode(): GainNode | null {
    return this.gainNode;
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (this.gainNode) {
      this.gainNode.gain.value = enabled ? 0.3 : 0;
    }
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public dispose(): void {
    if (this.context) {
      this.context.close();
      this.context = null;
      this.gainNode = null;
    }
  }
}
