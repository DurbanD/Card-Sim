import {Card} from './Card';
import {Player} from './Player';
import {Deck} from './Deck';

export interface Ruleset {
    hands : string[];
    name : string;
}
export interface testResult {
    matchType: string,
    bool: boolean,
    types?: string[],
    highCard?: Card | null,
    highCards?: Card[],
    cardsMatched? : Card[][],
    index? : number[],
    needKicker? : boolean
}
export class Ruleset {
    constructor () {
        this.hands = [];
        this.name = "Undefined Ruleset";
    }

    deal(players:Player[], deck:Deck) : any {
        return undefined;
    }

    test(hands:Card[], query:string) {
        
        return {matchType:'undefined', bool:false};
    }

    testAll = (hand: Card[]) => {
        let res = {matchType:'Test',bool:false};

        for (let i = this.hands.length - 1; i > -1; i--) {
            let test = this.test(hand, this.hands[i]);
            if (!test) continue;
            if (test.bool) {
                res = test;
                break;
            }
        }
        return res;
    }

    bestTest(tests:testResult[]) :testResult{
        return {matchType: '', bool: false};
    }

    findWinningPlayer(players:Player[], communityCards: Card[]) : Player {
        return players[0];
    }

}