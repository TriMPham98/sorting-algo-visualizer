import * as THREE from 'three';

export enum BarState {
  Default = 'default',
  Comparing = 'comparing',
  Swapping = 'swapping',
  Sorted = 'sorted',
}

const STATE_COLORS: Record<BarState, number> = {
  [BarState.Default]: 0x4fc3f7,
  [BarState.Comparing]: 0xffeb3b,
  [BarState.Swapping]: 0xff5252,
  [BarState.Sorted]: 0x69f0ae,
};

export class Bar {
  public mesh: THREE.Mesh;
  public value: number;
  private state: BarState = BarState.Default;

  private static geometry: THREE.BoxGeometry | null = null;

  constructor(value: number, position: THREE.Vector3) {
    this.value = value;

    if (!Bar.geometry) {
      Bar.geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    const material = new THREE.MeshPhongMaterial({
      color: STATE_COLORS[BarState.Default],
    });

    this.mesh = new THREE.Mesh(Bar.geometry, material);
    this.updateHeight(value);
    this.mesh.position.copy(position);
    this.mesh.position.y = value / 2;
  }

  public updateHeight(value: number): void {
    this.value = value;
    this.mesh.scale.y = value;
    this.mesh.position.y = value / 2;
  }

  public setState(state: BarState): void {
    this.state = state;
    const material = this.mesh.material as THREE.MeshPhongMaterial;
    material.color.setHex(STATE_COLORS[state]);
  }

  public getState(): BarState {
    return this.state;
  }

  public setPositionX(x: number): void {
    this.mesh.position.x = x;
  }

  public dispose(): void {
    const material = this.mesh.material as THREE.MeshPhongMaterial;
    material.dispose();
  }
}
