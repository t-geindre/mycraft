import Grass from './Grass';
import Dirt from './Dirt';
import Stone from './Stone';
import Water from './Water';
import {Scene} from 'babylonjs';

export class Materials
{
    static GRASS = "grass";
    static DIRT = "dirt";
    static STONE = "stone";
    static WATER = "water";
};

export const loadMaterials = function (scene: Scene) {
    [
        { material: Grass, name: Materials.GRASS },
        { material: Dirt, name: Materials.DIRT },
        { material: Stone, name: Materials.STONE },
        { material: Water, name: Materials.WATER },
    ].forEach(
        material => material.material(scene, material.name)
    );
};