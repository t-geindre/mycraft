import * as BABYLON from 'babylonjs';
import {SimplexNoise} from "ts-perlin-simplex";

export class ElevationGenerator
{
    private noise: SimplexNoise;

    private spline = [
        // { from: -1, to: 1, evol: [0, 0] },
        { from: -1, to: -.8, evol: [-10, -10] },
        { from: -.8, to: .7, evol: [-10, 20] },
        { from: .7, to: .99, evol: [20, 40] },
        { from: .99, to: 1, evol: [40, 50] },
    ];

    constructor() {
        this.noise = new SimplexNoise();
    }

    getAt(position: BABYLON.Vector2): BABYLON.Vector3
    {
        // divide position smooth the terrain
        let height = this.noise.noise(position.x / 100, position.y / 100);


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