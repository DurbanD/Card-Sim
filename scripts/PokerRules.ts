import { TypeFlags } from 'typescript';
import {Card} from './Card';

export interface Ruleset {
    hands : string[];
    name : string;
}
interface testResult {
    matchType: string,
    bool: boolean,
    types?: string[],
    highCard?: Card | null,
    highCards?: Card[],
    cardsMatched? : Card[][]
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
        this.name = "Poker Ruleset";
    }

    testFlush(cards:Card[]) {
        let sp = [], hrt = [], cl = [], dia = [],
            res:testResult = {
            matchType: 'Flush',
            bool : false,
            types : new Array(),
            highCards : new Array(),
            cardsMatched : new Array()
        };

        for (let card of cards) {
            switch (card.suite) {
                case 'spades':
                    sp.push(card);
                    break;
                case 'hearts':
                    hrt.push(card);
                    break;
                case 'clubs':
                    cl.push(card);
                    break;
                case 'diamonds':
                    dia.push(card);
                    break;
                default:
                    break;
            }
        }
        if (sp.length >= 5) {
            sp.sort((a,b)=>a.val-b.val);
            res.bool = true;
            if (res.types) res.types.push('Spades');
            else res.types = ['Spades'];
            
            if (sp[0].val === 1) res.highCards ? res.highCards.push(sp[0]) : res.highCards = [sp[0]];
            else res.highCards ? res.highCards.push(sp[sp.length-1]) : res.highCards = [sp[sp.length-1]];

            res.cardsMatched ? res.cardsMatched.push(sp) : res.cardsMatched = [sp];
        }

        if (cl.length >= 5) {
            cl.sort((a,b)=>a.val-b.val);
            res.bool = true;
            if (res.types) res.types.push('Clubs');
            else res.types = ['Clubs'];
            
            if (cl[0].val === 1) res.highCards ? res.highCards.push(cl[0]) : res.highCards = [cl[0]];
            else res.highCards ? res.highCards.push(cl[cl.length-1]) : res.highCards = [cl[cl.length-1]];

            res.cardsMatched ? res.cardsMatched.push(cl) : res.cardsMatched = [cl];
        }
        if (hrt.length >= 5) {
            hrt.sort((a,b)=>a.val-b.val);
            res.bool = true;
            if (res.types) res.types.push('Hearts');
            else res.types = ['Hearts'];
            
            if (hrt[0].val === 1) res.highCards ? res.highCards.push(hrt[0]) : res.highCards = [hrt[0]];
            else res.highCards ? res.highCards.push(hrt[hrt.length-1]) : res.highCards = [hrt[hrt.length-1]];

            res.cardsMatched ? res.cardsMatched.push(hrt) : res.cardsMatched = [hrt];
        }
        if (dia.length >= 5) {
            dia.sort((a,b)=>a.val-b.val);
            res.bool = true;
            if (res.types) res.types.push('Diamonds');
            else res.types = ['Diamonds'];
            
            if (dia[0].val === 1) res.highCards ? res.highCards.push(dia[0]) : res.highCards = [dia[0]];
            else res.highCards ? res.highCards.push(dia[dia.length-1]) : res.highCards = [dia[dia.length-1]];

            res.cardsMatched ? res.cardsMatched.push(dia) : res.cardsMatched = [dia];
        }
        return res;
    }

    testStraight = (cards:Card[]) => {
        let C = Array.from(cards.sort((a,b)=>a.val - b.val)),
            run = 1,
            ace = C[0].val === 1 ? C[0] : null;

        let res:testResult = {
            matchType: 'Straight',
            bool: false,
            highCard:null
        }
        for (let i = 1; i < C.length; i++) {
            if (C[i].val === C[i-1].val) continue;
            if (C[i].val - C[i-1].val == 1) run++;
            else run = 1;

            if (C[i].val === 1) ace = C[i];

            if (run >= 5 || (run >= 4 && C[i].val == 13 && ace !== null)) {
                res.bool = true;
                if (ace !== null) res.highCard = ace;
                res.highCard = C[i];
            }
        }
        return res;
    }

    testStraightFlush = (cards:Card[]) => {
        let flushRes = this.testFlush(cards),
            res : testResult = {
                matchType : 'Straight Flush',
                types: [],
                bool : false,
                highCard : null
            }
        if (flushRes.cardsMatched) for (let match of flushRes.cardsMatched) {
            let straightRes = this.testStraight(match);
            if (straightRes.bool === true) {
                res.bool = true;
                if (res.highCard === null || (res.highCard && straightRes.highCard && straightRes.highCard.val > res.highCard.val)) res.highCard = straightRes.highCard;
            }
        }
        if (res.highCard) res.types?.push(res.highCard.suite);
        return res;
    }

    testRoyalFlush = (cards:Card[]) : {matchType: string, bool : boolean, types:string[], highCards:Card[]} => {
        let sp : Card[] = new Array(5), cl : Card[]  = new Array(5), hr : Card[]  = new Array(5), dia : Card[]  = new Array(5);
        let res = {
            matchType: 'Royal Flush',
            bool : false,
            types : new Array(),
            highCards : new Array()
        }

        for (let card of cards) {
            switch(card.suite) {
                case 'spades':
                    if (9 < card.val && card.val < 14) sp[card.val% 10] = card;
                    if (card.val === 1) sp[4] = card;
                    break;
                case 'clubs':
                    if (9 < card.val && card.val < 14) cl[card.val%10] = card;
                    if (card.val === 1) cl[4] = card;
                    break;
                case 'hearts':
                    if (9 < card.val && card.val < 14) hr[card.val%10] = card;
                    if (card.val === 1) hr[4] = card;
                    break;
                case 'diamonds':
                    if (9 < card.val && card.val < 14) dia[card.val%10] = card;
                    if (card.val === 1) dia[4] = card;
                    break;
            }
        }

        let spFull = sp.filter(i=>i!==undefined),
            clFull = cl.filter(i=>i!==undefined),
            hrFull = hr.filter(i=>i!==undefined),
            diaFull = dia.filter(i=>i!==undefined);
        if (spFull.length === 5) {
            res.bool = true;
            res.types.push('Spades');
            res.highCards.push(sp[4]);
        }
        if (clFull.length === 5) {
            res.bool = true;
            res.types.push('Clubs');
            res.highCards.push(cl[4]);
        }
        if (hrFull.length === 5) {
            res.bool = true;
            res.types.push('Hearts');
            res.highCards.push(hr[4]);
        }
        if (diaFull.length === 5) {
            res.bool = true;
            res.types.push('Diamonds');
            res.highCards.push(dia[4]);
        }
            
        return res;
    }
}

export const PokerRules = new Ruleset();