import {Card} from './Card';
import {testResult} from './Ruleset';

export interface Player {
    name: string,
    hand : {bestMatch:testResult|null, cards: Card[]};
}

export class Player {
    constructor(name:string) {
        this.name = name;
        this.hand = {bestMatch : null, cards: []};
    }
}