import Engine from "./Engine/Engine";
import Explosion from "./Effect/Explosion";
import Triangle from "./Ship/Triangle";

const engine = new Engine();

engine.canvas.width = 1600;
engine.canvas.height = 800;

let colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#f13cff",
    "#fff14d",
];
engine.canvas.addEventListener("click", (event: MouseEvent) => {
    let color = colors[Math.floor(Math.random() * colors.length)];
    new Explosion(engine, event.offsetX, event.offsetY, color, 1000);
});

engine.drawPool.add(new Triangle());

engine.run();
