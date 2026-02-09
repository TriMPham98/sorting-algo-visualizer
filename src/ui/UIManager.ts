import { VisualizationController, ControllerState } from '../core/VisualizationController';
import { AudioManager } from '../audio/AudioManager';

export class UIManager {
  private controller: VisualizationController;
  private audioManager: AudioManager;

  private algorithmSelect: HTMLSelectElement;
  private arraySizeSlider: HTMLInputElement;
  private arraySizeValue: HTMLSpanElement;
  private speedSlider: HTMLInputElement;
  private speedValue: HTMLSpanElement;
  private playPauseBtn: HTMLButtonElement;
  private resetBtn: HTMLButtonElement;
  private soundToggle: HTMLInputElement;

  constructor(controller: VisualizationController, audioManager: AudioManager) {
    this.controller = controller;
    this.audioManager = audioManager;

    this.algorithmSelect = document.getElementById('algorithm') as HTMLSelectElement;
    this.arraySizeSlider = document.getElementById('arraySize') as HTMLInputElement;
    this.arraySizeValue = document.getElementById('arraySizeValue') as HTMLSpanElement;
    this.speedSlider = document.getElementById('speed') as HTMLInputElement;
    this.speedValue = document.getElementById('speedValue') as HTMLSpanElement;
    this.playPauseBtn = document.getElementById('playPauseBtn') as HTMLButtonElement;
    this.resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
    this.soundToggle = document.getElementById('soundToggle') as HTMLInputElement;

    this.bindEvents();
    this.controller.setStateChangeCallback(this.handleStateChange.bind(this));
  }

  private bindEvents(): void {
    this.algorithmSelect.addEventListener('change', () => {
      this.controller.setAlgorithm(this.algorithmSelect.value);
    });

    this.arraySizeSlider.addEventListener('input', () => {
      const size = parseInt(this.arraySizeSlider.value, 10);
      this.arraySizeValue.textContent = size.toString();
      this.controller.setArraySize(size);
    });

    this.speedSlider.addEventListener('input', () => {
      const speed = parseInt(this.speedSlider.value, 10);
      this.speedValue.textContent = speed.toString();
      this.controller.setSpeed(speed);
    });

    this.playPauseBtn.addEventListener('click', async () => {
      await this.audioManager.initialize();
      await this.audioManager.resume();

      const state = this.controller.getState();
      if (state === 'running') {
        this.controller.pause();
      } else {
        this.controller.play();
      }
    });

    this.resetBtn.addEventListener('click', () => {
      this.controller.reset();
    });

    this.soundToggle.addEventListener('change', () => {
      this.audioManager.setEnabled(this.soundToggle.checked);
    });
  }

  private handleStateChange(state: ControllerState): void {
    switch (state) {
      case 'idle':
        this.playPauseBtn.textContent = 'Play';
        this.playPauseBtn.classList.remove('playing');
        this.setControlsEnabled(true);
        break;

      case 'running':
        this.playPauseBtn.textContent = 'Pause';
        this.playPauseBtn.classList.add('playing');
        this.setControlsEnabled(false);
        break;

      case 'paused':
        this.playPauseBtn.textContent = 'Resume';
        this.playPauseBtn.classList.remove('playing');
        this.setControlsEnabled(false);
        break;

      case 'completed':
        this.playPauseBtn.textContent = 'Play';
        this.playPauseBtn.classList.remove('playing');
        this.setControlsEnabled(true);
        break;
    }
  }

  private setControlsEnabled(enabled: boolean): void {
    this.algorithmSelect.disabled = !enabled;
    this.arraySizeSlider.disabled = !enabled;
  }
}
