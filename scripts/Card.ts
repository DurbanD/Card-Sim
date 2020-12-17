export interface Card {
    val : number;
    suite : string;
}

export class Card {
    constructor(val : number, suite : string) {
        this.val = val;
        this.suite = suite;
    }
}
