import {StandardMaterial, Color3, Scene} from 'babylonjs';

export default function (scene: Scene, name: string) {
    let grassMaterial = new StandardMaterial(name, scene);
    grassMaterial.diffuseColor = new Color3(.1, 0.8, .0);

    return grassMaterial;
}