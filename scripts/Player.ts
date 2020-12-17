import {Card} from './Card';

export interface Player {
    name: string,
    hand : Card[];
}

export class Player {
    constructor(name:string) {
        this.name = name;
        this.hand = [];
    }
}