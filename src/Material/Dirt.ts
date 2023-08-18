import {StandardMaterial, Color3, Scene} from 'babylonjs';

export default function (scene: Scene, name: string) {
    let grassMaterial = new StandardMaterial(name, scene);
    grassMaterial.diffuseColor = new Color3(.6, .2, .0);

    return grassMaterial;
}