import * as BABYLON from 'babylonjs';
import {Block} from "./Block";

export class Sand implements Block {

    private material: BABYLON.StandardMaterial = null;

    init(scene: BABYLON.Scene): void {
        this.material = new BABYLON.StandardMaterial("block_sand", scene);
        this.material.diffuseTexture = new BABYLON.Texture(require('../../assets/sand.png'), scene);
    }

    spawn(scene: BABYLON.Scene, size: number): BABYLON.Mesh {
        if (this.material === null) {
            this.init(scene);
        }

        let block = BABYLON.CreateBox('sand_block', {size});
        block.material = this.material;

        return  block;
    }

    spawnAt(scene: BABYLON.Scene, size: number, position: BABYLON.Vector3): BABYLON.Mesh {
        let block = this.spawn(scene, size);
        block.position = position;

        return block;
    }
}