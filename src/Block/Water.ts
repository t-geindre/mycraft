import * as BABYLON from 'babylonjs';
import {BlockSpawner} from "./BlockSpawner";

export class Water extends BlockSpawner
{
    private material: BABYLON.StandardMaterial;
    protected getSourceBlock(scene: BABYLON.Scene, size: number): BABYLON.Mesh
    {
        if (!this.material) {
            this.material = new BABYLON.StandardMaterial("water_block", scene);
            this.material.diffuseColor = new BABYLON.Color3(.1, .1, .9);
            this.material.alpha = .7;
            this.material.freeze();
        }

        let block = BABYLON.CreateGround("plane", {width: size, height: 1}, scene);
        block.material = this.material;

        return block;
    }
}