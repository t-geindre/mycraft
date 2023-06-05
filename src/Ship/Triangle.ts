import Engine from "../Engine/Engine";

export default class Triangle {
    constructor() {
    }
    draw(engine: Engine) {
        engine.ctx.fillStyle = "#FF0000";
        engine.ctx.beginPath();
        engine.ctx.moveTo(25, 25);
        engine.ctx.lineTo(105, 25);
        engine.ctx.lineTo(25, 105);
        engine.ctx.fill();
    }
}