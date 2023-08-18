import * as BABYLON from 'babylonjs';

export abstract class BlockSpawner {
    private sourceBlock: BABYLON.Mesh = null;

    protected abstract getSourceBlock(scene: BABYLON.Scene, size: number): BABYLON.Mesh;

    public spawn(scene: BABYLON.Scene, size: number, position: BABYLON.Vector3): BABYLON.AbstractMesh
    {
        if (this.sourceBlock === null) {
            this.sourceBlock = this.getSourceBlock(scene, size);
            this.sourceBlock.isVisible = false;
        }

        let block = this.sourceBlock.createInstance('block');
        block.position = position;

        // Optimization: only check block bounding box when rendering
        block.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;

        // Optimization: freeze world matrix to improve performance
        block.freezeWorldMatrix();

        return block;
    }
}