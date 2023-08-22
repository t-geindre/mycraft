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
        // Biome config
        let biomeBlockSpawners = {
            ground: Blocks.grass.start(scene, this.blockSize),
            underground: Blocks.dirt.start(scene, this.blockSize),
            water: Blocks.water.start(scene, this.blockSize),
            underwater: Blocks.sand.start(scene, this.blockSize),
        };

        for (let j = 0; j < this.chunkSize; j++) {
            for (let i = 0; i < this.chunkSize; i++) {
                let position = new BABYLON.Vector2(
                    this.chunkPosition.x + i * this.blockSize,
                    this.chunkPosition.y + j * this.blockSize,
                );

                let blockPosition = elevatioGenerator.getAt(position);
                blockPosition.y = blockPosition.y * this.blockSize;

                let groundSpawner : BlockSpawner = biomeBlockSpawners.ground;

                if (blockPosition.y < -5) {
                    groundSpawner = biomeBlockSpawners.underwater;
                    biomeBlockSpawners.water.spawn(new BABYLON.Vector3(blockPosition.x, -5, blockPosition.z));
                }
                groundSpawner.spawn(blockPosition.clone());

                for (let k = 0; k < 3; k++) {
                    blockPosition.y -= this.blockSize;
                    biomeBlockSpawners.underground.spawn(blockPosition);
                }
            }
        }

        this.blocks.push(biomeBlockSpawners.ground.flush());
        this.blocks.push(biomeBlockSpawners.underground.flush());
        this.blocks.push(biomeBlockSpawners.water.flush());
        this.blocks.push(biomeBlockSpawners.underwater.flush());
    }

    public dispose() {
        this.blocks.forEach(function(block) {
            if (block !== null) {
                block.dispose();
            }
        });
    }
}