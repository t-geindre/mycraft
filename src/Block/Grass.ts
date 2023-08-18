import * as BABYLON from 'babylonjs';
import {Block} from "./Block";

export class Grass implements Block {

    private faceUV = [
        new BABYLON.Vector4(0, 0, 1 / 6, 1), // back
        new BABYLON.Vector4(1 / 6, 0, 2 / 6, 1), // front
        new BABYLON.Vector4(2 / 6, 0, 3 / 6, 1), // right
        new BABYLON.Vector4(3 / 6, 0, 4 / 6, 1), // left
        new BABYLON.Vector4(5 / 6, 0, 6 / 6, 1), // top
        new BABYLON.Vector4(5 / 6, 0, 4 / 6, 1), // bottom
    ];

    private material: BABYLON.StandardMaterial = null;

    init(scene: BABYLON.Scene): void {
        this.material = new BABYLON.StandardMaterial("block_grass", scene);
        this.material.diffuseTexture = new BABYLON.Texture(require('../../assets/grass.png'), scene);
    }

    spawn(scene: BABYLON.Scene, size: number): BABYLON.Mesh {
        if (this.material === null) {
            this.init(scene);
        }

        let block = BABYLON.CreateBox('grass_block', {size, faceUV: this.faceUV});
        block.material = this.material;

        return  block;
    }

    spawnAt(scene: BABYLON.Scene, size: number, position: BABYLON.Vector3): BABYLON.Mesh {
        let block = this.spawn(scene, size);
        block.position = position;

        return block;
    }
}