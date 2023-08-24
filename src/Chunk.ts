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
        // Biome config
        let biomeBlockSpawners = {
            ground: Blocks.grass.start(scene, this.blockSize),
            underground: Blocks.dirt.start(scene, this.blockSize),
            deepGround:  Blocks.stone.start(scene, this.blockSize),
            water: Blocks.water.start(scene, this.blockSize),
            underwater: Blocks.sand.start(scene, this.blockSize),
        };


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

                if (blockPosition.y < waterLevel || elevationAround.some(elevation => elevation < waterLevel)) {
                    groundSpawner = biomeBlockSpawners.underwater;
                }

                if (blockPosition.y < waterLevel) {
                    biomeBlockSpawners.water.spawn(new BABYLON.Vector3(blockPosition.x, waterLevel, blockPosition.z));
                }
                groundSpawner.spawn(blockPosition.clone());

                // put underground block if elevation is going up more than 1 block
                let elevationDiff = elevationAround.reduce((acc, elevation) => { return Math.min(acc, elevation - blockPosition.y) }, 0);

                if (elevationDiff < -1) {
                    for (let k = -1; k > elevationDiff; k--) {
                        blockPosition.y -= this.blockSize;
                        if (k < -3) {
                            biomeBlockSpawners.deepGround.spawn(blockPosition);
                            continue;
                        }
                        biomeBlockSpawners.underground.spawn(blockPosition);
                    }
                }
            }
        }

        this.blocks.push(biomeBlockSpawners.ground.flush());
        this.blocks.push(biomeBlockSpawners.underground.flush());
        this.blocks.push(biomeBlockSpawners.water.flush());
        this.blocks.push(biomeBlockSpawners.underwater.flush());
        this.blocks.push(biomeBlockSpawners.deepGround.flush());
    }

    public dispose() {
        this.blocks.forEach(function(block) {
            if (block !== null) {
                block.dispose();
            }
        });
    }
}