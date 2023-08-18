import * as BABYLON from 'babylonjs';

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

    public generate(scene: BABYLON.Scene) {
        console.log("Generating chunk");
        for (let j = 0; j < this.chunkSize; j++) {
            for (let i = 0; i < this.chunkSize; i++) {
                let type = ["grass", "water"][Math.floor(Math.random() * 2)];

                let block;
                //    block = BABYLON.CreatePlane("plane", {size: this.blockSize}, scene);
                block = BABYLON.CreateBox("box", {size: this.blockSize}, scene);

                block.position.x = this.chunkPosition.x + i * this.blockSize;
                block.position.z = this.chunkPosition.y + j * this.blockSize;
                block.position.y = 0;
                block.material = scene.getMaterialByName(type);

                this.blocks.push(block);
            }
        }
    }

    public dispose() {
        this.blocks.forEach(function(block) {
            block.dispose();
        });
    }
}