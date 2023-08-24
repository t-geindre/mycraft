import * as BABYLON from 'babylonjs';
import * as BABYLON_MATERIALS from 'babylonjs-materials';
import {World} from './World';
import {ElevationGenerator} from "./Ground/ElevationGenerator";

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

scene.autoClear = false;
scene.autoClearDepthAndStencil = false;

// Light
let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 1), scene);

// Skybox
const skyMaterial = new BABYLON_MATERIALS.SkyMaterial("skyMaterial", scene);
skyMaterial.backFaceCulling = false;
skyMaterial.luminance = .1;
skyMaterial.useSunPosition = true; // Do not set sun position from azimuth and inclination
skyMaterial.sunPosition = new BABYLON.Vector3(0, 100, 0);

const skybox = BABYLON.MeshBuilder.CreateSphere("skyBox", { diameter: 900.0 }, scene);
skybox.material = skyMaterial;

// World creation
let elevationGenerator = new ElevationGenerator();
let world = new World(elevationGenerator);

// Camera
let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, elevationGenerator.getWaterLevel() + 80, -10), scene);
camera.attachControl(canvas, true);
camera.setTarget(new BABYLON.Vector3(0, elevationGenerator.getWaterLevel() + 50, 100));

// Camera automatic motion
let cameraAutomaticMotion = true;
window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        cameraAutomaticMotion = !cameraAutomaticMotion;
    }
});

// Main rendering loop
scene.onBeforeRenderObservable.add(() => {
    // Update skybox position to follow camera
    skyMaterial.cameraOffset.y = scene.activeCamera.globalPosition.y;
    skybox.position.x = scene.activeCamera.globalPosition.x;
    skybox.position.z = scene.activeCamera.globalPosition.z;

    // Camera automatic motion
    if (cameraAutomaticMotion) {
        camera.position.z += 2;
        camera.rotation.y = BABYLON.Tools.ToRadians(Math.sin(camera.position.z / 600) * 180);
        scene.activeCamera.position.y += (elevationGenerator.getAt(
            new BABYLON.Vector2(scene.activeCamera.globalPosition.x, scene.activeCamera.globalPosition.z)
        ).y - scene.activeCamera.position.y + 40) * .04;
    }
});

// World update coroutine
let worldUpdateCoroutine: () => IterableIterator<void>;
worldUpdateCoroutine = function *() : IterableIterator<void> {
    while (world.update(scene, camera).next()) {
        yield;
    }
    scene.onBeforeRenderObservable.runCoroutineAsync(worldUpdateCoroutine());
    yield;
};
scene.onBeforeRenderObservable.runCoroutineAsync(worldUpdateCoroutine());

// Main rendering loop
engine.runRenderLoop(() => scene.render());