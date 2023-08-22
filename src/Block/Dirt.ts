import * as BABYLON from 'babylonjs';
import {BlockSpawner} from "./BlockSpawner";

export class Dirt extends BlockSpawner
{
    protected getSourceBlock(scene: BABYLON.Scene, size: number): BABYLON.Mesh
    {
        let  faceUV = [
            new BABYLON.Vector4(5 / 6, 0, 4 / 6, 1), // Use the bottom face of dirt texture
            new BABYLON.Vector4(5 / 6, 0, 4 / 6, 1),
            new BABYLON.Vector4(5 / 6, 0, 4 / 6, 1),
            new BABYLON.Vector4(5 / 6, 0, 4 / 6, 1),
            new BABYLON.Vector4(5 / 6, 0, 4 / 6, 1),
            new BABYLON.Vector4(5 / 6, 0, 4 / 6, 1),
        ];

        let material = new BABYLON.StandardMaterial("block_dirt", scene);
        material.diffuseTexture = new BABYLON.Texture(require('../../assets/grass.png'), scene);
        material.freeze();

        let block = BABYLON.CreateBox('block_dirt', {size, faceUV});
        block.material = material;

        return block;
    }
}