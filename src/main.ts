import { Scene } from './core/Scene';
import { AnimationLoop } from './core/AnimationLoop';
import { BarManager } from './visualization/BarManager';
import { VisualizationController } from './core/VisualizationController';
import { AudioManager } from './audio/AudioManager';
import { SoundEffects } from './audio/SoundEffects';
import { UIManager } from './ui/UIManager';
import './styles.css';

function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const scene = new Scene(canvas);
  const animationLoop = new AnimationLoop();
  const barManager = new BarManager(scene);
  const audioManager = new AudioManager();
  const soundEffects = new SoundEffects(audioManager);
  const controller = new VisualizationController(barManager, soundEffects);
  new UIManager(controller, audioManager);

  controller.initialize();

  animationLoop.onRender(() => {
    scene.render();
  });

  animationLoop.start();
}

document.addEventListener('DOMContentLoaded', main);
