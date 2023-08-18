import * as BABYLON from 'babylonjs';
import {SimplexNoise} from "ts-perlin-simplex";
import {Blocks} from "./Block";
import {BlockSpawner} from "./Block/BlockSpawner";

export class Chunk
{
    private blocks: BABYLON.AbstractMesh[];
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

                let groundSpawner : BlockSpawner = Blocks.grass;

                if (position.y < -5) {
                    groundSpawner = Blocks.sand;
                    this.blocks.push(Blocks.water.spawn(
                        scene,
                        this.blockSize,
                        new BABYLON.Vector3(position.x, -5, position.z)
                    ));
                }

                this.blocks.push(groundSpawner.spawn(scene, this.blockSize, position));
            }
        }
    }

    public dispose() {
        this.blocks.forEach(function(block) {5
            block.dispose();
        });
    }
}