import * as BABYLON from 'babylonjs';

export abstract class BlockSpawner {
    private sourceBlock: BABYLON.Mesh = null;
    private firstPositionSet: boolean = false;
    private matrix: BABYLON.Matrix[] = [];

    protected abstract getSourceBlock(scene: BABYLON.Scene, size: number): BABYLON.Mesh;

    public start(scene: BABYLON.Scene, size: number)
    {
        this.sourceBlock = this.getSourceBlock(scene, size);
        this.firstPositionSet = false;
        this.matrix = [];

        return this;
    }

    public spawn(position: BABYLON.Vector3)
    {
        position = position.clone();

        if (!this.firstPositionSet) {
            this.sourceBlock.position = position;
            this.firstPositionSet = true;
        }

        this.matrix.push(BABYLON.Matrix.Translation(
            position.x - this.sourceBlock.position.x,
            position.y - this.sourceBlock.position.y,
            position.z - this.sourceBlock.position.z,
        ));
    }

    public flush(): BABYLON.Mesh | null
    {

        if (this.matrix.length > 0) {
            this.sourceBlock.thinInstanceAdd(this.matrix);

            return this.sourceBlock;
        }

        if (!this.firstPositionSet) {
            this.sourceBlock.dispose();

            return null;
        }

        this.sourceBlock.freezeWorldMatrix();

        return this.sourceBlock;
    }
}