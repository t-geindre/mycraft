import * as BABYLON from 'babylonjs';
import {Block} from "./Block";

export class Water implements Block {
    private material: BABYLON.StandardMaterial = null;

    spawn(scene: BABYLON.Scene, size: number): BABYLON.Mesh {
        if (this.material === null) {
            this.material = new BABYLON.StandardMaterial("water_block", scene);
            this.material.diffuseColor = new BABYLON.Color3(.1, .1, .8);
            this.material.alpha = .5;
        }

        let block = BABYLON.CreatePlane("plane", {size}, scene);
        block.rotation.x = BABYLON.Tools.ToRadians(90);
        block.material = this.material;

        return block;
    }

    spawnAt(scene: BABYLON.Scene, size: number, position: BABYLON.Vector3): BABYLON.Mesh {
        let block = this.spawn(scene, size);
        block.position = position;

        return block;
    }
}