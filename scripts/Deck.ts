import {Card} from './Card';
// import {PokerRules} from './PokerRules';

export interface Deck {
    cards : Array<Card>;
    discards : Array<object>
}

export class Deck {
    constuctor() {
        this.cards = [];
        this.discards = new Array();
    }

    buildStandardDeck() {
        let suites = ['spades','clubs','hearts','diamonds'],
            deck = [];
        for (let suite of suites) {
            for (let i = 1; i <= 13; i++ ) {
                let card = new Card(i,suite);
                deck.push(card);
            }
        }
        return deck;
    }

    setStandardDeck() {
        this.cards = this.buildStandardDeck();
    }

    addCard(val : number, suite : string) {
        this.cards.push(new Card(val,suite));
    }

    isCard(val : number, suite : string) {
        if (!this.cards || this.cards.length < 1) return Error('Not Enough Cards');
        for (let card of this.cards) {
            if (card.val === val && card.suite === suite) return true;
        }
        return false;
    }

    shuffle() {
        if (!this.cards || this.cards.length < 2) return Error('Cannot Shuffle. Build More Cards');
        let res = new Array(this.cards.length).fill(null);

        for (let card of this.cards) {
            let randPos = Math.floor(Math.random() * res.length);
            while (res[randPos] !== null) randPos = Math.floor(Math.random() * res.length);
            res[randPos] = card;
        }
        this.cards = res;
    }

    shuffleIn(cards:Card[]) {
        let newCards = this.cards;
        while(cards.length > 0) {
            let card = cards.pop();
            if (card !== undefined) newCards.push(card);
        }
        this.cards = newCards;
        this.shuffle();
    }

    dealTop(target:Card[], deck : Card[] = this.cards) {
        if (deck.length < 1) return Error('Deck is Empty');
        let card = deck.pop();
        if (card !== undefined) target.push(card);
    }

    dealBottom(target:Card[], deck : Card[] = this.cards) {
        if (deck.length < 1) return Error('Not Enough Cards');
        let card  = deck.shift();
        if (card !== undefined) target.push(card);
    }

    dealRound(targets:Card[][], number: number) {
        for (let i = 0; i < number; i++) {
            for (let hand of targets) this.dealTop(hand);
        }
    }

}