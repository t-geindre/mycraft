import Engine from "../Engine/Engine";
import Updatable from "../Engine/Updatable";
import Drawable from "../Engine/Drawable";

export default class Particle implements Updatable, Drawable{

    private x: number;
    private y: number;
    private velocityX: number;
    private velocityY: number;
    private color: string;
    private lifeSpan: number;

    constructor(x: number, y: number, velocityX: number, velocityY: number, color: string, lifeSpan: number) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = color;
        this.lifeSpan = lifeSpan;
    }

    draw(engine: Engine) {
        let previousAlpha = engine.ctx.globalAlpha;

        engine.ctx.globalAlpha = Math.min(1, this.lifeSpan / 30);
        engine.ctx.fillStyle = this.color;
        engine.ctx.fillRect(this.x, this.y, 3, 3);

        engine.ctx.globalAlpha = previousAlpha;
    }

    update(engine: Engine) {
        this.x = this.x + this.velocityX;
        this.y = this.y + this.velocityY;

        this.lifeSpan--;

        this.velocityY = this.velocityY + .05;

        if (this.x < 0 || this.x > engine.canvas.width) {
            this.velocityX = -this.velocityX;
        }

        if (this.y < 0 || this.y > engine.canvas.height) {
            this.velocityY = -this.velocityY;
        }

        if (this.lifeSpan <= 0) {
            engine.drawPool.remove(this);
            engine.updatePool.remove(this);
        }
    }
}