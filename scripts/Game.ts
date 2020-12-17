import { Deck } from './Deck';
import {Ruleset} from './Ruleset';
import {PokerRuleset} from './Poker';
// import {Deck} from './Deck';
import {Card} from './Card';
import {Player} from './Player';

interface Game {
    ruleset: Ruleset
    deck: Deck;
    players: Player[];
}

class Game {
    constructor(deck:Deck, ruleset:Ruleset, players:Player[]) {
        this.deck = deck;
        this.deck.setStandardDeck();
        this.ruleset = ruleset;
        this.players = players;
    }

    play() : {players:Player[], hands: Card[][], river: Card[]} {
        this.players.forEach(p=>this.deck.shuffleIn(p.hand)); 
        if (this.deck.cards.length === 0) this.deck.setStandardDeck();
        const deal : {players:Player[], hands:Card[][], river:Card[]}= this.ruleset.deal(this.players,this.deck);
        let res = {
            players : Array.from(deal.players),
            hands : Array.from(deal.hands),
            river : Array.from(deal.river)
        }

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
const stDeck = new Deck(),
    P1 = new Player('1'),
    P2 = new Player('2'),
    P3 = new Player('3');
stDeck.buildStandardDeck();

const newGame = new Game(new Deck(), PokerRuleset, [P1,P2,P3]);
let holdem3 = newGame.play();
for (let P of holdem3.players) console.log('Player '+ P.name, P.hand);
console.log(holdem3.river);
// console.log(holdem3.players, '\n', holdem3.hands, '\n', holdem3.river);