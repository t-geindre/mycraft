import * as BABYLON from 'babylonjs';

export interface Block {
    spawn(scene: BABYLON.Scene, size: number): BABYLON.Mesh;
    spawnAt(scene: BABYLON.Scene, size: number, position: BABYLON.Vector3): BABYLON.Mesh;
}