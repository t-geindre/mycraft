import {StandardMaterial, Color3, Scene} from 'babylonjs';

export default function (scene: Scene, name: string) {
    let grassMaterial = new StandardMaterial(name, scene);
    grassMaterial.diffuseColor = new Color3(.1, .1, .8);
    grassMaterial.alpha = .5;

    return grassMaterial;
}