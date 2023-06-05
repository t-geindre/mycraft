import Engine from "./Engine";

export default interface Updatable {
    update(engine: Engine): void;
}