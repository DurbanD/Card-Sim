import { Deck } from './Deck';
import { Ruleset, testResult } from './Ruleset';
import {Card} from './Card';
import {Player} from './Player';
import { PokerRuleset } from './Poker';

export interface Game {
    ruleset: Ruleset
    deck: Deck;
    players: Player[];
}

export class Game {
    constructor(deck:Deck, ruleset:Ruleset, players:Player[]) {
        this.deck = deck;
        this.deck.setStandardDeck();
        this.ruleset = ruleset;
        this.players = players;
    }

    play() : {players:Player[], hands: {name:string,hand:Card[], matchTest:testResult|null}[], river: Card[], win:{player:Player|null, hand:Card[]|null, test:testResult|null}} {
        this.players.forEach(p=>this.deck.shuffleIn(p.hand.cards)); 
        if (this.deck.cards.length !== 52) this.deck.setStandardDeck();

        const deal : { players:Player[], hands:Card[][], river:Card[] } = this.ruleset.deal(this.players,this.deck),
            winner = this.ruleset.findWinningPlayer(deal.players,deal.river);

        let res : {players:Player[], hands:{name:string, hand:Card[], matchTest:testResult|null}[] ,river:Card[], win: {player:Player|null, hand:Card[]|null, test:testResult|null} } = {
            players : Array.from(deal.players),
            hands : [],
            river : Array.from(deal.river),
            win: {player:winner, hand:winner.hand.cards, test:winner.hand.bestMatch}
        }

        for (let player of deal.players) {
            let hand = Array.from(player.hand.cards);
            res.river.forEach(c=>hand.push(c));
            res.hands.push({name:player.name, hand:player.hand.cards, matchTest: player.hand.bestMatch});
        }

        return res;

        // let bestTests = [];
        for (let i = 0; i < res.players.length; i++) {
            let P = res.players[i],
                hand = Array.from(P.hand.cards);
            res.river.forEach(c=>hand.push(c));
            P.hand.bestMatch = this.ruleset.testAll(hand);

            // bestTests.push(P.hand.bestMatch);
            // P.hand.bestMatch = test;

            res.hands.push({name : P.name, hand : hand, matchTest: P.hand.bestMatch});
        }
        // res.win.test = this.ruleset.bestTest(bestTests);
        // if (res && !res.win.test || !res.win.test.index) return res;
        // if (res.win?.test.index?.length === 1) {
        //     res.win.player = res.players[res.win?.test.index[0]];
        //     res.win.hand = res.hands[res.win?.test.index[0]].hand;
        // }
        // else if (res.win.test && res.win.test.index && res.win.test.index.length > 1) {
        //     let tiedPlayers : Player[] = [],
        //         tiedHands : Card[][] = [];
        //     res.win?.test.index.forEach(i=>{
        //         let playerHand = Array.from(res.hands[i].hand);
        //         tiedPlayers.push(res.players[i]);

        //         playerHand.forEach(c=> c.val === 1 ? c.val = 14 : c.val = c.val);
        //         tiedHands.push(playerHand.sort((a,b)=>b.val-a.val));

        //     });

        //     let maxPlayer = null,
        //         maxCard = null,
        //         maxHand = null;
        //     for (let i = 1; i < tiedHands.length; i++) {
        //         let last = tiedHands[i-1],
        //             cur = tiedHands[i];
        //         for (let j = 0; j < Math.min(last.length,cur.length); j++) {
        //             if (last[j].val > cur[j].val || (maxCard && last[j].val > maxCard.val)) {
        //                 maxCard = last[j];
        //                 maxPlayer = tiedPlayers[i-1];
        //                 maxHand = last;
        //             }
        //             if (cur[j].val > last[j].val || (maxCard && cur[j].val > maxCard.val)) {
        //                 maxCard = cur[j];
        //                 maxPlayer = tiedPlayers[i];
        //                 maxHand = cur;
        //             }
        //         }
        //     }

        //     if (maxPlayer) {
        //         res.win.player = maxPlayer;
        //         res.win.hand = maxHand;
        //     }
        // }

        return res;
    }

    addPlayer(player:Player) {
        this.players.push(player);
    }

    removePlayer(playerName:string) {
        let found = -1;
        for (let i = 0; i < this.players.length && found === -1; i++) {
            if (playerName === this.players[i].name) found = i;
        }

        if (found === -1) return false;
        this.players.splice(found,1);
        return true;
    }
}