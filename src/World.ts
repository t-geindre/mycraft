import {Chunk} from "./Chunk";
import * as BABYLON from 'babylonjs';
import {ElevationGenerator} from "./Ground/ElevationGenerator";

export class World
{
    private chunks: Chunk[];
    private chunkSize: number;
    private chunkFromCamera: number;
    private blockSize: number;
    private elevationGenerator: ElevationGenerator;

    constructor(elevationGenerator: ElevationGenerator, chunkSize: number = 64, chunkFromCamera: number = 8, blockSize: number = 1) {
        this.chunks = [];
        this.chunkSize = chunkSize;
        this.chunkFromCamera = chunkFromCamera;
        this.blockSize = blockSize;
        this.elevationGenerator = elevationGenerator;
    }

    *update(scene: BABYLON.Scene, camera: BABYLON.Camera): IterableIterator<any> {
        this.clearTooFarChunks(scene, camera);

        while (this.populateMissingChunks(scene, camera).next()) {
            yield;
        }

    }
    clearTooFarChunks(scene: BABYLON.Scene, camera: BABYLON.Camera) {
        let cameraPosition2d = new BABYLON.Vector2(camera.position.x, camera.position.z);
        let maxDistance = this.chunkSize * this.blockSize * (this.chunkFromCamera + 1)

        this.chunks = this.chunks.filter(chunk => {
            if (
                Math.abs(cameraPosition2d.x - chunk.getPosition().x) > maxDistance
                || Math.abs(cameraPosition2d.y - chunk.getPosition().y) > maxDistance
            ) {
                chunk.dispose();

                return false;
            }

            return true;
        });
    }

    *populateMissingChunks(scene: BABYLON.Scene, camera: BABYLON.Camera) : IterableIterator<any> {
        let newChunks = false;

        let cameraChunkPosition = new BABYLON.Vector2(
            Math.floor(camera.position.x / (this.chunkSize * this.blockSize)),
            Math.floor(camera.position.z / (this.chunkSize * this.blockSize)),
        );

        for (let j = -this.chunkFromCamera; j <= this.chunkFromCamera; j++) {
            for (let i = -this.chunkFromCamera; i <= this.chunkFromCamera; i++) {
                let chunkPosition = new BABYLON.Vector2(
                    (cameraChunkPosition.x + i) * this.chunkSize * this.blockSize,
                    (cameraChunkPosition.y + j) * this.chunkSize * this.blockSize,
                );

                if (this.createChunk(scene, chunkPosition)) {
                    newChunks = true;
                    yield;
                }
            }
        }

        return newChunks;
    }

    createChunk(scene: BABYLON.Scene, chunkPosition: BABYLON.Vector2) {
        if (!this.hasChunk(chunkPosition)) {
            let chunk = new Chunk(this.chunkSize, chunkPosition, this.blockSize);
            chunk.generate(scene, this.elevationGenerator);
            this.chunks.push(chunk);

            return true;
        }

        return false;
    }

    hasChunk(chunkPosition: BABYLON.Vector2) {
        for (let i = 0; i < this.chunks.length; i++) {
            if (this.chunks[i].getPosition().equals(chunkPosition)) {
                return true;
            }
        }

        return false;
    }

    dispose() {
        this.chunks.forEach(function (chunk) {
            chunk.dispose();
        });
        this.chunks = [];
    }
}