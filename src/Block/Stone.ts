import * as BABYLON from 'babylonjs';
import {BlockSpawner} from "./BlockSpawner";

export class Stone extends BlockSpawner
{
    private material: BABYLON.StandardMaterial;

    protected getSourceBlock(scene: BABYLON.Scene, size: number): BABYLON.Mesh
    {
        if (!this.material) {
            this.material = new BABYLON.StandardMaterial("block_stone", scene);
            this.material.diffuseTexture = new BABYLON.Texture(require('../../assets/stone.png'), scene);
            this.material.specularColor = new BABYLON.Color3(0, 0, 0);
            this.material.freeze();
        }

        let block = BABYLON.CreateBox('stone_block', {size});
        block.material = this.material;

        return block;
    }
}