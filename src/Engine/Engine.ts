import Pool from "./Pool";
import Drawable from "./Drawable";
import Updatable from "./Updatable";

export default class Engine {

    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public clearStyle: string;
    public drawPool: Pool<Drawable>;
    public updatePool: Pool<Updatable>;

    constructor(canvas: HTMLCanvasElement = undefined, clearStyle = "black") {
        if (!canvas) {
            let canvasElements = document.getElementsByTagName("canvas");
            if (canvasElements.length === 0) {
                throw new Error("No canvas element found");
            }
            canvas = canvasElements.item(0);
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.drawPool = new Pool();
        this.updatePool = new Pool();
        this.clearStyle = clearStyle;
    }

    run() {
        this.update();
        this.ctx.fillStyle = this.clearStyle;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw()
        window.requestAnimationFrame(() => this.run());
    }

    update() {
        this.updatePool.forEach((item) => {
            item.update(this);
        });
    }

    draw() {
        this.drawPool.forEach((item) => {
            item.draw(this);
        });
    }
}