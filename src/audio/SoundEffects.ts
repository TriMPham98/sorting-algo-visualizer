import { AudioManager } from './AudioManager';

export class SoundEffects {
  private audioManager: AudioManager;
  private minFreq = 200;
  private maxFreq = 800;
  private maxValue = 20;

  constructor(audioManager: AudioManager) {
    this.audioManager = audioManager;
  }

  private valueToFrequency(value: number): number {
    const ratio = value / this.maxValue;
    return this.minFreq + ratio * (this.maxFreq - this.minFreq);
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    const context = this.audioManager.getContext();
    const gainNode = this.audioManager.getGainNode();

    if (!context || !gainNode || !this.audioManager.getEnabled()) return;

    const oscillator = context.createOscillator();
    const envelope = context.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    envelope.gain.setValueAtTime(0, context.currentTime);
    envelope.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

    oscillator.connect(envelope);
    envelope.connect(gainNode);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  }

  public playCompare(value1: number, value2: number): void {
    const freq1 = this.valueToFrequency(value1);
    const freq2 = this.valueToFrequency(value2);

    this.playTone(freq1, 0.05, 'sine');
    setTimeout(() => {
      this.playTone(freq2, 0.05, 'sine');
    }, 25);
  }

  public playSwap(value1: number, value2: number): void {
    const context = this.audioManager.getContext();
    const gainNode = this.audioManager.getGainNode();

    if (!context || !gainNode || !this.audioManager.getEnabled()) return;

    const freq1 = this.valueToFrequency(value1);
    const freq2 = this.valueToFrequency(value2);
    const duration = 0.1;

    const oscillator = context.createOscillator();
    const envelope = context.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(freq1, context.currentTime);
    oscillator.frequency.linearRampToValueAtTime(freq2, context.currentTime + duration);

    envelope.gain.setValueAtTime(0, context.currentTime);
    envelope.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

    oscillator.connect(envelope);
    envelope.connect(gainNode);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  }

  public playSet(value: number): void {
    this.playTone(this.valueToFrequency(value), 0.05, 'triangle');
  }

  public playSorted(value: number): void {
    this.playTone(this.valueToFrequency(value), 0.08, 'sine');
  }

  public async playCompletion(_barCount: number): Promise<void> {
    const context = this.audioManager.getContext();
    if (!context || !this.audioManager.getEnabled()) return;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    const duration = 0.15;

    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playTone(notes[i], duration * 2, 'sine');
      }, i * (duration * 1000));
    }
  }
}
