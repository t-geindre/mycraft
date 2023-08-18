import * as BABYLON from 'babylonjs';
import {SimplexNoise} from "ts-perlin-simplex";
import {Blocks} from "./Block";

export class Chunk
{
    private blocks: BABYLON.Mesh[];
    private blockSize: number;
    private chunkSize: number;
    private chunkPosition: BABYLON.Vector2;

    constructor(chunkSize: number, chunkPosition: BABYLON.Vector2, blockSize: number) {
        this.chunkSize = chunkSize;
        this.chunkPosition = chunkPosition;
        this.blocks = [];
        this.blockSize = blockSize;
    }

    public getPosition() {
        return this.chunkPosition;
    }

    public generate(scene: BABYLON.Scene, noise: SimplexNoise) {
        for (let j = 0; j < this.chunkSize; j++) {
            for (let i = 0; i < this.chunkSize; i++) {
                let position = new BABYLON.Vector3(
                    this.chunkPosition.x + i * this.blockSize,
                    0,
                    this.chunkPosition.y + j * this.blockSize,
                );

                position.y = Math.ceil(noise.noise(position.x / 100, position.z / 100) * 10) * this.blockSize

                if (position.y < -5) {
                    this.blocks.push(Blocks.water.spawnAt(
                        scene,
                        this.blockSize,
                        new BABYLON.Vector3(position.x, -5, position.z)
                    ));
                }

                this.blocks.push(Blocks.grass.spawnAt(scene, this.blockSize, position));
            }
        }
    }

    public dispose() {
        this.blocks.forEach(function(block) {
            block.dispose();
        });
    }
}