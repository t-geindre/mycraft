import {Grass} from './Grass';
import {Water} from './Water';
import {Sand} from './Sand';

export const Blocks = new class
{
    public grass = new Grass();
    public water = new Water();
    public sand = new Sand();
};