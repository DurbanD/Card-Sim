import { Ruleset, testResult } from './Ruleset';
import { Card } from './Card';
import { Player } from './Player';
import { Deck } from './Deck';

export class Poker extends Ruleset {
    constructor() {
        super();
        this.hands = [
            'high-card',
            'pair',
            'two-pair',
            'three-kind',
            'straight',
            'flush',
            'full-house',
            'four-kind',
            'straight-flush',
            'royal-flush'
        ];
        this.name = "Poker Ruleset";
    }

    dealHoldem = (players:Player[],  deck:Deck, river:Card[] = []) : {players:Player[], river:Card[]}=> {
        let hands : Card[][] = new Array(players.length);
        if (river && river.length > 0) deck.shuffleIn(river);
        if (deck.cards.length !== 52) deck.setStandardDeck();

        for (let i = 0; i < players.length; i++) {
            let P = players[i];
            if (P.hand.cards.length > 0) deck.shuffleIn(P.hand.cards);
            hands[i] = P.hand.cards;
        }
        deck.dealRound(hands,2);
        deck.dealRound([river],5);

        return {players:players, river:river};
    }

    deal = (players:Player[], deck:Deck) : object => {
        return this.dealHoldem(players,deck);
    }

    testMatching = (cards:Card[], numCardsToMatch:number) : testResult => {
        let tmp = new Array(14),
            res : testResult = {
                matchType: `${numCardsToMatch} of a Kind`,
                bool: false,
                highCard: null,
                cardsMatched: []
            }
        if (numCardsToMatch === 2) res.matchType = 'pair';
        if (numCardsToMatch === 3) res.matchType = 'three-kind';
        if (numCardsToMatch === 4) res.matchType = 'four-kind';
        // else res.matchType = `${numCardsToMatch} of a kind`;

        for (let i = 0; i < cards.length; i++) {
            if (tmp[cards[i].val - 1] !== undefined) tmp[cards[i].val-1].push(cards[i]);
            else tmp[cards[i].val-1] = [cards[i]];
        }

        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i] && tmp[i].length >= numCardsToMatch) {
                let T : Card[] = Array.from(tmp[i]);
                res.bool = true;

                if ((!res.highCard) || (res.highCard && T[0].val > res.highCard.val))  res.highCard = T[0];

                if (res.cardsMatched && res.cardsMatched.length === 0) res.cardsMatched = [T];
                else if (res.cardsMatched) res.cardsMatched.push(T);

            }
        }

        return res;
    }

    testForFlush(cards:Card[]) {
        let sp = [], hrt = [], cl = [], dia = [],
            res:testResult = {
            matchType: 'flush',
            bool : false,
            types : new Array(),
            highCard : null,
            cardsMatched : new Array()
        },
            C = Array.from(cards).sort((a,b)=>a.val-b.val);


        for (let card of C) {
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
        //Card Array must be sorted to generate highCard/highCards;
        const validate = (arr:Card[], suite:string) => {
            if (arr.length >= 5) {
                arr = arr.sort((a,b)=>a.val - b.val);
                res.bool = true;
                if (!res) return false;

                res.types ?  res.types.push(suite) : res.types = [suite];

                let high = arr[0].val === 1 ? arr[0] : arr[arr.length-1];
                if (!res.highCard || high.val > res.highCard.val) res.highCard = high;
                res.highCards?.push(high);

                res.cardsMatched ? res.cardsMatched.push(arr) : res.cardsMatched = [arr];

                if (!res.highCard || arr[0])
                return true;
            }
            return false;
        }

        validate(sp,'Spades');
        validate(cl,'Clubs');
        validate(hrt, 'Hearts');
        validate(dia,'Diamonds');

        return res;
    }

    testForStraight = (cards:Card[]) => {
        let C = Array.from(cards.sort((a,b)=>a.val - b.val)),
            ace = C[0].val === 1 ? C[0] : null,
            res : testResult = {
                matchType: 'straight',
                bool : false,
                highCard: null,
                cardsMatched: []
            }
        let straights = [[C[0]]],
            index = 0;
        for (let i = 1; i < C.length; i++) {
            if (C[i].val - straights[index][straights[index].length-1].val === 1) straights[index].push(C[i]);
            else {
                index++;
                straights[index] = [C[i]];
            }

            if (C[i].val === 13 && ace) straights[index].push(ace);
        }
        straights.filter(S=>S.length>=5);
        for (let S of straights) {
            let high = S[0].val === 1 ? S[0] : S[S.length-1];
            if (S.length >= 5 && (!res.highCard || high.val > res.highCard.val)) {
                while (S.length > 5) {
                    let tmp = S.shift(); 
                    if (tmp && tmp.val === 1) {
                        S.push(tmp);
                    }
                }
                res.bool = true;
                res.highCard = high;
                res.cardsMatched = [S];
            };
        }

        return res;
    }

    testForStraightFlush = (cards:Card[]) => {
        let flushRes = this.testForFlush(cards),
            res : testResult = {
                matchType : 'straight-flush',
                types: [],
                bool : false,
                highCard : null,
                cardsMatched: []
            }
        if (flushRes.cardsMatched) for (let match of flushRes.cardsMatched) {
            let straightRes = this.testForStraight(match);
            if (straightRes.bool) {
                res.bool = true;
                if (!res.highCard || (res.highCard && straightRes.highCard && straightRes.highCard.val > res.highCard.val)) {
                    res.highCard = straightRes.highCard;
                    res.cardsMatched = straightRes.cardsMatched;
                }
            }
        }
        if (res.highCard) res.types?.push(res.highCard.suite);
        return res;
    }

    testForRoyalFlush = (cards:Card[]) : {matchType: string, bool : boolean, types:string[], highCards:Card[]} => {
        let sp : Card[] = new Array(5), cl : Card[]  = new Array(5), hr : Card[]  = new Array(5), dia : Card[]  = new Array(5);
        let res = {
            matchType: 'royal-flush',
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

    testForFullHouse = (hand: Card[]) => {
        let threeTest = this.testMatching(hand,3),
            twoTest = this.testMatching(hand,2),
            res : testResult= {
                matchType: "Full House",
                bool: false,
                highCard: null,
                cardsMatched: []
            }
        if (!threeTest.bool || !twoTest.bool || (twoTest.cardsMatched && twoTest.cardsMatched.length < 2)) return res;
        res.cardsMatched = new Array(2);

        if (threeTest.cardsMatched) for (let match of threeTest.cardsMatched) {
            if (res.cardsMatched[0] === undefined || match[0].val > res.cardsMatched[0][0].val) {
                res.cardsMatched[0] = match;
                res.highCard = match[0];
            }
        }

        if (twoTest.cardsMatched) for (let match of twoTest.cardsMatched) {
            if ((res.cardsMatched[1] === undefined || match[0].val > res.cardsMatched[1][0].val) && match[0].val !== res.cardsMatched[0][0].val) res.cardsMatched[1] = match;
        }

        return res;
    }

    testForHighCard = (hand:Card[]) : testResult => {
        let res : testResult = {
            matchType: 'high-card',
            bool: false,
            highCard: null
        }
        for (let card of hand) {
            if (card.val === 1) {
                res.bool = true;
                res.highCard = card;
                break;
            }
            if (res.highCard === null || (res.highCard && card.val > res.highCard.val)) {
                res.bool = true;
                res.highCard = card;
            }
        }
        return res;
    }

    testForTwoPair = (hand:Card[]) => {
        let twoTest = this.testMatching(hand,2),
            res : testResult = {
                matchType: 'two-pair',
                bool: false,
                highCard: null,
                cardsMatched: [],
            }
        if (!twoTest || !twoTest.bool || !twoTest.cardsMatched || twoTest.cardsMatched.length < 2) return res;
        else res.bool = true;

        res.cardsMatched = new Array(2);
        res.cardsMatched[0] = twoTest.cardsMatched[0];
        res.highCard = twoTest.cardsMatched[0][0];

        for (let i = 1; i < twoTest.cardsMatched.length; i++) {
            let match = twoTest.cardsMatched[i];

            // If there is no second match, take the second match as given by the pair test.
            if (res.cardsMatched[1] === undefined && match[0].val !== res.cardsMatched[0][0].val) res.cardsMatched[1] = match;
            // If there are more than two pairs take the ace and/or the two highest values pairs.
            else if (res.cardsMatched[1] !== undefined) {
                let newMatch : Card[][] =  [res.cardsMatched[0], res.cardsMatched[1], match];
                newMatch = newMatch.sort((a,b)=>a[0].val - b[0].val);
                if (newMatch && newMatch.length === 3) {
                    if (newMatch[0][0].val === 1) newMatch.pop();
                    else newMatch.shift();

                    res.cardsMatched = Array.from(newMatch);
                }
            }
            res.cardsMatched[0][0].val === 1 ? res.highCard = res.cardsMatched[0][0] : res.highCard = res.cardsMatched[1][0]; 
        }

        return res;
    }

    test = (hand:Card[], query:string) : testResult => {
        let res : testResult = {matchType:'Test',bool:false};
        switch(query) {
            case 'high-card':
                res =  this.testForHighCard(hand);
                break;
            case 'pair':
                res =  this.testMatching(hand,2);
                break;
            case 'two-pair':
                res =  this.testForTwoPair(hand);
                break;
            case 'three-kind':
                res =  this.testMatching(hand,3);
                break;
            case 'four-kind':
                res =  this.testMatching(hand,4);
                break;
            case 'full-house':
                res =  this.testForFullHouse(hand);
                break;
            case 'straight':
                res =  this.testForStraight(hand);
                break;
            case 'flush':
                res =  this.testForFlush(hand);
                break;
            case 'straight-flush':
                res =  this.testForStraightFlush(hand);
                break;
            case 'royal-flush':
                res =  this.testForRoyalFlush(hand);
                break;
            default:
                console.log(Error(`Unable to test hand. ${query} is invalid.`));
                break;
        }
        return res;
    }

    bestTest = (testResults:testResult[]) => {
        let res = {
            matchType: 'Best Match Undefined',
            bool: false,
            index : [-1],
            needKicker: false
        }

        for (let i = this.hands.length - 1; i > -1; i--) {
            let found = false,
                solo = true,
                indices = [];
            for (let j = 0; j < testResults.length; j++) {
                let testRes = testResults[j];
                if (testRes && testRes.bool && testRes.matchType === this.hands[i]) {
                    if (found === false) found = true;
                    else solo = false;

                    indices.push(j)
                }
            }

            if (found) {
                res.matchType = this.hands[i];
                res.index = indices;
                if (!solo) res.needKicker = true;
            }
        }
        return res;
    }


    //This function is having issues breaking ties (Kicker).
    //Figure it out
    findWinningPlayer = (players:Player[],communityCards:Card[]) => {
        let hands = new Map(),
            maxVal : number  = -1,
            winIndex: number[] = [];

        for (let i = 0; i < players.length; i++) {
            let P = players[i],
                hand = Array.from(P.hand.cards),
                val = 0;

            for (let C of communityCards) hand.push(C);
            P.hand.bestMatch = this.testAll(hand);
            hands.set(P.name, hand);

            while(this.hands[val] !== P.hand.bestMatch.matchType && val < this.hands.length) val++;
            if (val === this.hands.length) console.log([val,maxVal,winIndex,hands,this.hands[val], P.hand.bestMatch.matchType]);

            if (val < this.hands.length && val > maxVal) {
                maxVal = val;
                winIndex = [i];
            }
            else if (val < this.hands.length && val === maxVal) winIndex.push(i);

        };

        if (maxVal > -1 && winIndex.length === 1) return players[winIndex[0]];
        else if (maxVal > -1) {
            let showdown = [];
            for (let i of winIndex) {
                showdown.push(players[i]);
            }
            let H = Array.from(showdown.map(p=> p = hands.get(p.name)));
            H.forEach(h=>{ 
                h.forEach( ( c: Card ) => c.val === 1 ? c.val = 14 : c.val = c.val ); 
                h.sort( ( a:Card,b:Card ) => a.val - b.val );
            });
            H.sort((a,b)=>a.length - b.length);

            for (let i = 0; i <  H[0].length; i++) {
                let tmp = H[0][i];
                for (let j = i+1; j < showdown.length; j++) {
                    if (H[j][i].val > tmp.val) return showdown[j];
                    if (H[j][i].val < tmp.val) return showdown[i];
                }
            }
        }

        return new Player('win-test-fail');
    }
}

export const PokerRuleset = new Poker();