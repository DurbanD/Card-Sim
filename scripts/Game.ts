import { Deck } from './Deck';
import {Ruleset} from './PokerRules';
// import {Deck} from './Deck';
import {Card} from './Card';
import {Player} from './Player';

interface Game {
    ruleset: Ruleset
    deck: Deck;
}

class Game {
    constructor(deck:Deck, ruleset:Ruleset) {
        this.deck = deck;
        this.ruleset = ruleset;
    }

    deal(players:Player[]) {
        return undefined;
    }
}