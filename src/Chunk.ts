import * as BABYLON from 'babylonjs';
import {Blocks} from "./Block";
import {BlockSpawner} from "./Block/BlockSpawner";
import {ElevationGenerator} from "./Ground/ElevationGenerator";

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

    public generate(scene: BABYLON.Scene, elevatioGenerator: ElevationGenerator) {
        for (let j = 0; j < this.chunkSize; j++) {
            for (let i = 0; i < this.chunkSize; i++) {
                let position = new BABYLON.Vector2(
                    this.chunkPosition.x + i * this.blockSize,
                    this.chunkPosition.y + j * this.blockSize,
                );

                let blockPosition = elevatioGenerator.getAt(position);
                blockPosition.y * this.blockSize;

                let groundSpawner : BlockSpawner = Blocks.grass;

                if (blockPosition.y < -5) {
                    groundSpawner = Blocks.sand;
                    this.blocks.push(Blocks.water.spawn(
                        scene,
                        this.blockSize,
                        new BABYLON.Vector3(blockPosition.x, -5, blockPosition.z)
                    ));
                }

                this.blocks.push(groundSpawner.spawn(scene, this.blockSize, blockPosition));
                blockPosition.y -= this.blockSize;
                this.blocks.push(Blocks.dirt.spawn(scene, this.blockSize, blockPosition));
            }
        }
    }

    public dispose() {
        this.blocks.forEach(function(block) {5
            block.dispose();
        });
    }
}