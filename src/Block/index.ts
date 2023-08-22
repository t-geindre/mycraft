import {Grass} from './Grass';
import {Water} from './Water';
import {Sand} from './Sand';
import {Dirt} from "./Dirt";

export const Blocks = new class
{
    public grass = new Grass();
    public water = new Water();
    public sand = new Sand();
    public dirt = new Dirt();
};