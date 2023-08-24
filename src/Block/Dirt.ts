import * as BABYLON from 'babylonjs';
import {BlockSpawner} from "./BlockSpawner";

export class Dirt extends BlockSpawner
{
    private material: BABYLON.StandardMaterial;
    private faceUV: BABYLON.Vector4[];

    protected getSourceBlock(scene: BABYLON.Scene, size: number): BABYLON.Mesh
    {
        if (!this.faceUV) {
            this.faceUV = [
                new BABYLON.Vector4(5 / 6, 0, 4 / 6, 1), // Use the bottom face of dirt texture
                new BABYLON.Vector4(5 / 6, 0, 4 / 6, 1),
                new BABYLON.Vector4(5 / 6, 0, 4 / 6, 1),
                new BABYLON.Vector4(5 / 6, 0, 4 / 6, 1),
                new BABYLON.Vector4(5 / 6, 0, 4 / 6, 1),
                new BABYLON.Vector4(5 / 6, 0, 4 / 6, 1),
            ];
        }

        if (!this.material) {
            this.material = new BABYLON.StandardMaterial("block_dirt", scene);
            this.material.diffuseTexture = new BABYLON.Texture(require('../../assets/grass.png'), scene);
            this.material.specularColor = new BABYLON.Color3(0, 0, 0);
            this.material.freeze();
        }

        let block = BABYLON.CreateBox('block_dirt', {size, faceUV: this.faceUV});
        block.material = this.material;

        return block;
    }
}