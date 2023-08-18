import * as BABYLON from 'babylonjs';
import {BlockSpawner} from "./BlockSpawner";

export class Sand extends BlockSpawner
{
    protected getSourceBlock(scene: BABYLON.Scene, size: number): BABYLON.Mesh
    {
        let material = new BABYLON.StandardMaterial("block_sand", scene);
        material.diffuseTexture = new BABYLON.Texture(require('../../assets/sand.png'), scene);
        material.freeze();

        let block = BABYLON.CreateBox('sand_block', {size});
        block.material = material;

        return block;
    }
}