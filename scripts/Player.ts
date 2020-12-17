import {Card} from './Card';

export interface Player {
    hand : Card[];
}

export class Player {
    constructor() {
        this.hand = new Array();
    }
}