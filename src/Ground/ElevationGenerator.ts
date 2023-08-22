import * as BABYLON from 'babylonjs';
import {SimplexNoise} from "ts-perlin-simplex";

export class ElevationGenerator
{
    private noiseOctOne: SimplexNoise;
    private noiseOctTwo: SimplexNoise;
    private noiseOctThree: SimplexNoise;

    private spline = [
        { from: -1, to: 1, evol: [-20, 100] },
        { from: -1, to: 1, evol: [-20, 100] },
        { from: -1, to: .3, evol: [-20, 100] },
        { from: .3, to: .4, evol: [100, 120] },
        { from: .4, to: 1, evol: [120, 120] },
    ];

    constructor() {
        this.noiseOctOne = new SimplexNoise()
        this.noiseOctTwo = new SimplexNoise()
        this.noiseOctThree = new SimplexNoise()
    }

    private getNoise(x: number, y: number) {
        let noise = this.noiseOctOne.noise(x / 300, y / 300);
        // noise += this.noiseOctOne.noise(x / 100, y / 100) * .1;
        // noise += this.noiseOctOne.noise(x / 1000, y / 1000) * .2;
        noise += this.noiseOctOne.noise(x / 20, y / 20) * .02;
        noise += this.noiseOctOne.noise(x / 100, y / 100) * .1;

        return Math.max(-1, Math.min(noise, 1));
    }

    getAt(position: BABYLON.Vector2): BABYLON.Vector3
    {
        // divide position smooth the terrain
        let height = this.getNoise(position.x, position.y);

        // apply spline points
        let spline = this.spline.find(
            spline => spline.from <= height && spline.to >= height
        );

        let splinedHeight = spline.evol[0] + ((height - spline.from) / (spline.to - spline.from) * (spline.evol[1] - spline.evol[0]));

        return new BABYLON.Vector3(
            position.x,
            Math.ceil(splinedHeight),
            position.y
        );
    }
}