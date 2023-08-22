import * as BABYLON from 'babylonjs';
import {World} from './World';

// Canvas creation
let canvas = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
document.getElementsByTagName("body")[0].appendChild(canvas);


// Engine & scene creation
let engine = new BABYLON.Engine(canvas, true);
let scene = new BABYLON.Scene(engine, {
    // Options to speed up add/remove mesh from scene
    // see https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene#reducing-draw-calls
    useGeometryUniqueIdsMap: true,
    useMaterialMeshMap: true,
    useClonedMeshMap: true,

});
scene.clearColor = new BABYLON.Color4(.8, .8, 1, 1);

// Camera & light
let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0), scene);
light.lightmapMode = BABYLON.Light.LIGHTMAP_SPECULAR;

let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, -10), scene);
camera.attachControl(canvas, true);
camera.setTarget(new BABYLON.Vector3(0, 5, 0));

// World creation
let world = new World();

// Main rendering loop
scene.onBeforeRenderObservable.add(() => world.update(scene, camera));
engine.runRenderLoop(() => scene.render());