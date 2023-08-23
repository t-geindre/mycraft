import * as BABYLON from 'babylonjs';
import {BlockSpawner} from "./BlockSpawner";

export class Sand extends BlockSpawner
{
    private material: BABYLON.StandardMaterial;

    protected getSourceBlock(scene: BABYLON.Scene, size: number): BABYLON.Mesh
    {
        if (!this.material) {
            this.material = new BABYLON.StandardMaterial("block_sand", scene);
            this.material.diffuseTexture = new BABYLON.Texture(require('../../assets/sand.png'), scene);
            this.material.freeze();
        }

        let block = BABYLON.CreateBox('sand_block', {size});
        block.material = this.material;

        return block;
    }
}