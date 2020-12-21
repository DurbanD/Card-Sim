import {Card} from './Card';

export interface Deck {
    cards : Array<Card>;
}

export class Deck {
    constuctor() {
        this.cards = [];
    }

    buildStandardDeck() {
        let suites = ['spades','clubs','hearts','diamonds'],
            deck : Card[] = [];
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
        return true;
    }

    removeCard(val:number, suite:string) {
        let found = -1;
        for (let i = 0; i < this.cards.length; i++) {
            let cur = this.cards[i];
            if (cur.suite === suite && cur.val === val) {
                found = i;
                break;
            }
        }
        if (found > -1) {
            this.cards.splice(found,1);
            return true;
        }
        return false;
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

    shuffleIn(cards:Card[] = []) {
        while (cards.length > 0) {
            let cur = cards.pop();
            if (cur) this.addCard(cur.val, cur.suite);
        }
        this.shuffle();
    }

    dealTop(target:Card[], deck : Card[] = this.cards) {
        if (!deck || deck.length < 1) return Error('Deck is Empty');
        let card = deck.pop();
        if (card !== undefined) target.push(card);
    }

    dealBottom(target:Card[], deck : Card[] = this.cards) {
        if (!deck || deck.length < 1) return Error('Not Enough Cards');
        let card  = deck.shift();
        if (card !== undefined) target.push(card);
    }

    dealRound(targets:Card[][], number: number) {
        for (let i = 0; i < number; i++) {
            for (let hand of targets) this.dealTop(hand, this.cards);
        }
    }

}