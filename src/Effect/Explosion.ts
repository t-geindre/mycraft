import Particle from "./Particle";
import Engine from "../Engine/Engine";

export default class Explosion {
    constructor(
        engine: Engine,
        x: number,
        y: number,
        color = "red",
        particles = 1000
    ) {
        for (let i = 0; i < particles; i++) {
            let direction = 2 * Math.PI * Math.random();
            let particle = new Particle(
                x,
                y,
                (Math.random() * 5) * Math.cos(direction),
                (Math.random() * 5) * Math.sin(direction),
                color,
                Math.random() * 200
            );

            engine.drawPool.add(particle);
            engine.updatePool.add(particle);
        }
    }
}