import {Card} from './Card';
import {Player} from './Player';
import {Deck} from './Deck';

export interface Ruleset {
    hands : string[];
    name : string;
}


export class Ruleset {
    constructor () {
        this.hands = [
            'High Card',
            'Pair',
            'Two Pair',
            'Three of a Kind',
            'Straight',
            'Flush',
            'Full House',
            'Four of a Kind',
            'Straight Flush',
            'Royal Flush'
        ];
        this.name = "Undefined Ruleset";
    }

    deal(players:Player[], deck:Deck) : any {
        return undefined;
    }

}