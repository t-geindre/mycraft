import * as BABYLON from 'babylonjs';
import {BlockSpawner} from "./BlockSpawner";

export class Grass extends BlockSpawner
{
    protected getSourceBlock(scene: BABYLON.Scene, size: number): BABYLON.Mesh
    {
        let  faceUV = [
            new BABYLON.Vector4(0, 0, 1 / 6, 1), // back
            new BABYLON.Vector4(1 / 6, 0, 2 / 6, 1), // front
            new BABYLON.Vector4(2 / 6, 0, 3 / 6, 1), // right
            new BABYLON.Vector4(3 / 6, 0, 4 / 6, 1), // left
            new BABYLON.Vector4(5 / 6, 0, 6 / 6, 1), // top
            new BABYLON.Vector4(5 / 6, 0, 4 / 6, 1), // bottom
        ];

        let material = new BABYLON.StandardMaterial("block_grass", scene);
        material.diffuseTexture = new BABYLON.Texture(require('../../assets/grass.png'), scene);
        material.freeze();

        let block = BABYLON.CreateBox('grass_block', {size, faceUV});
        block.material = material;

        return block;
    }
}