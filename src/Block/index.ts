import * as BABYLON from 'babylonjs';
import {Grass} from './Grass';
import {Water} from './Water';

export const Blocks = new class
{
    public grass = new Grass();
    public water = new Water();

};