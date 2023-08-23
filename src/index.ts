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
scene.clearColor = new BABYLON.Color4(.8, .8, 1, 1);

// Light
let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0), scene);

// Skybox
const skyMaterial = new BABYLON_MATERIALS.SkyMaterial("skyMaterial", scene);
skyMaterial.backFaceCulling = false;
skyMaterial.luminance = .1;
skyMaterial.useSunPosition = true; // Do not set sun position from azimuth and inclination
skyMaterial.sunPosition = new BABYLON.Vector3(0, 100, 0);

const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
skybox.material = skyMaterial;

// World creation
let elevationGenerator = new ElevationGenerator();
let world = new World(elevationGenerator);

// Camera
let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, elevationGenerator.getWaterLevel()+80, -10), scene);
camera.attachControl(canvas, true);
camera.setTarget(new BABYLON.Vector3(0, elevationGenerator.getWaterLevel() + 70, 100));

// Main rendering loop
scene.onBeforeRenderObservable.add(() => {
    // Update skybox position to follow camera
    skyMaterial.cameraOffset.y = scene.activeCamera.globalPosition.y;
    skybox.position.x = scene.activeCamera.globalPosition.x;
    skybox.position.z = scene.activeCamera.globalPosition.z;

    // Update world (generate new chunk and remove too far chunks)
    world.update(scene, camera);

    // Camera automatic motion
    camera.position.x += 2;
    camera.rotation.y += BABYLON.Tools.ToRadians(Math.sin(camera.position.x / 100));
    scene.activeCamera.position.y += (elevationGenerator.getAt(
        new BABYLON.Vector2(scene.activeCamera.globalPosition.x, scene.activeCamera.globalPosition.z)
    ).y - scene.activeCamera.position.y + 40) * .05;
});
engine.runRenderLoop(() => scene.render());