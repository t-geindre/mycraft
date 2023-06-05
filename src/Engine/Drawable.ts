import Engine from "./Engine";

export default interface Drawable {
    draw(engine: Engine): void;
}