import * as BABYLON from 'babylonjs';
import {BlockSpawner} from "./BlockSpawner";

export class Water extends BlockSpawner
{
    protected getSourceBlock(scene: BABYLON.Scene, size: number): BABYLON.Mesh
    {
        let material = new BABYLON.StandardMaterial("water_block", scene);;
        material.diffuseColor = new BABYLON.Color3(.1, .1, .8);
        material.alpha = .5;
        material.freeze();

        let block = BABYLON.CreatePlane("plane", {size}, scene);
        block.rotation.x = BABYLON.Tools.ToRadians(90);
        block.material = material;

        return block;
    }
}