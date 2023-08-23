import * as BABYLON from 'babylonjs';
import {SimplexNoise} from "ts-perlin-simplex";

export class ElevationGenerator
{
    private noise: SimplexNoise;
    private erosionNoise: SimplexNoise;

    private spline = [
        // { from: -1, to: 1, evol: [50, 180] },
        { from: -1, to: .3, evol: [50, 100] },
        { from: .3, to: .6, evol: [100, 110] },
        { from: .6, to: .8, evol: [110, 140] },
        { from: .8, to: 1, evol: [140, 200] },
    ];
/*
        { from: -1, to: .3, evol: [50, 100] },
        { from: .3, to: .4, evol: [100, 150] },
        { from: .4, to: 1, evol: [150, 150] },

    [-1,0.3] => [50,100],
    [0.3,0.4] => [100, 150],
    [0.4,1] => [150,150]
*/
    getWaterLevel(): number
    {
        return 80;
    }

    constructor() {
        this.noise = new SimplexNoise();
        this.erosionNoise = new SimplexNoise();
    }

    private getNoise(x: number, y: number) {
        let noise = this.noise.noise(x / 1000, y / 1000);
        noise += this.noise.noise(x / 20, y / 20) * .02;
        noise += this.noise.noise(x / 100, y / 100) * .1;

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