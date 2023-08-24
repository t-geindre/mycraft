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

    public generate(scene: BABYLON.Scene, elevationGenerator: ElevationGenerator) {
        let biomeBlockSpawners = this.getBiomeBlockSpawners(scene);
        let waterLevel = elevationGenerator.getWaterLevel();
        elevationGenerator.clear();

        for (let j = 0; j < this.chunkSize; j++) {
            for (let i = 0; i < this.chunkSize; i++) {
                let position = new BABYLON.Vector2(
                    this.chunkPosition.x + i * this.blockSize,
                    this.chunkPosition.y + j * this.blockSize,
                );

                let blockPosition = elevationGenerator.getAt(position);
                blockPosition.y = blockPosition.y * this.blockSize;

                let elevationAround = [
                    elevationGenerator.getAt(new BABYLON.Vector2(position.x, position.y + this.blockSize)).y,
                    elevationGenerator.getAt(new BABYLON.Vector2(position.x, position.y - this.blockSize)).y,
                    elevationGenerator.getAt(new BABYLON.Vector2(position.x + this.blockSize, position.y + this.blockSize)).y,
                    elevationGenerator.getAt(new BABYLON.Vector2(position.x + this.blockSize, position.y - this.blockSize)).y,
                    elevationGenerator.getAt(new BABYLON.Vector2(position.x - this.blockSize, position.y + this.blockSize)).y,
                    elevationGenerator.getAt(new BABYLON.Vector2(position.x - this.blockSize, position.y - this.blockSize)).y,
                    elevationGenerator.getAt(new BABYLON.Vector2(position.x + this.blockSize, position.y)).y,
                    elevationGenerator.getAt(new BABYLON.Vector2(position.x - this.blockSize, position.y)).y,
                ];

                let groundSpawner : BlockSpawner = biomeBlockSpawners.ground;

                // Close to water, put an underwater block
                if (blockPosition.y < waterLevel || elevationAround.some(elevation => elevation < waterLevel)) {
                    groundSpawner = biomeBlockSpawners.underwater;
                }

                if (blockPosition.y < waterLevel) {
                    biomeBlockSpawners.water.spawn(new BABYLON.Vector3(blockPosition.x, waterLevel, blockPosition.z));
                }
                groundSpawner.spawn(blockPosition.clone());

                // put underground block if elevation is going up more than 1 block
                let elevationDiff = elevationAround.reduce(
                    (acc, elevation) => Math.min(acc, elevation - blockPosition.y),
                    0
                );

                if (elevationDiff < -this.blockSize) {
                    for (let k = -this.blockSize; k > elevationDiff; k -= this.blockSize) {
                        blockPosition.y -= this.blockSize;
                        biomeBlockSpawners.underground.spawn(blockPosition);
                    }
                }
            }
        }

        this.flushBlocks(biomeBlockSpawners);
    }

    private getBiomeBlockSpawners(scene: BABYLON.Scene) : { [key: string]: BlockSpawner } {
        return {
            ground: Blocks.grass.start(scene, this.blockSize),
            underground: Blocks.dirt.start(scene, this.blockSize),
            deepGround:  Blocks.stone.start(scene, this.blockSize),
            water: Blocks.water.start(scene, this.blockSize),
            underwater: Blocks.sand.start(scene, this.blockSize),
        };
    }

    private flushBlocks(blockSpawners: { [key: string]: BlockSpawner }) {
        Object.keys(blockSpawners).forEach(key => {
            this.blocks.push(blockSpawners[key].flush());
        });
    }

    public dispose() {
        this.blocks.forEach(function(block) {
            if (block !== null) {
                block.dispose();
            }
        });
    }
}