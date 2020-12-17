import {Deck} from './Deck';
import {Card} from './Card';
import {PokerRules, Ruleset} from './PokerRules';

const stDeck = new Deck();
stDeck.setStandardDeck();
stDeck.shuffle();

const dealUntilSuccess = function(deck:Deck,test:Function,cardsToDeal:number) {
    let cnt : number = 0,
        hand : Card[] = [],
        testResult;
    deck.shuffle();
    deck.dealRound([hand],cardsToDeal);
    testResult = test(hand);
    while (!testResult.bool) {
        deck.shuffleIn(hand);
        deck.dealRound([hand],cardsToDeal);
        testResult = test(hand);
        cnt++;
    }
    deck.shuffleIn(hand);
    return { finalResult: testResult, tries: cnt, cardsDealt: cardsToDeal}
}

const getAverageForTest = function(deck:Deck,test:Function,cardsToDeal:number,numberOfTests:number) {
    let sum = 0;
    for (let i = 0; i < numberOfTests; i++) {
        sum += dealUntilSuccess(deck,test,cardsToDeal).tries;
    }
    return Math.floor(sum/numberOfTests);
}

const dealAndTestNumHands = function(deck:Deck,ruleset:Ruleset,cardsToDeal:number,numHands:number) {
    let hand : Card[] = [],
        stCnt = 0, flCnt = 0, stFlCnt = 0, royFlCnt = 0;
    deck.shuffle();
    if (deck.cards.length !== 52) deck.setStandardDeck();
    for (let i = 0; i < numHands; i++) {
        deck.dealRound([hand],cardsToDeal);
        
        if (ruleset.testStraight(hand).bool) stCnt ++;
        if (ruleset.testFlush(hand).bool) flCnt++;
        if (ruleset.testStraightFlush(hand).bool) stFlCnt++;
        if (ruleset.testRoyalFlush(hand).bool) royFlCnt++;
        
        deck.shuffleIn(hand);
    }
    return {straight:stCnt, flush: flCnt, straightFlush: stFlCnt, royalFlush: royFlCnt};
}

const printAllOdds = function(deck:Deck,ruleset:Ruleset,cardsToDeal:number,numRepeat:number) {
    let straightAverage = getAverageForTest(deck,ruleset.testStraight, cardsToDeal, numRepeat),
        flushAverage = getAverageForTest(deck,ruleset.testFlush, cardsToDeal, numRepeat),
        straightFlushAverage = getAverageForTest(deck,ruleset.testStraightFlush, cardsToDeal, numRepeat),
        royalFlushAverage = getAverageForTest(deck,ruleset.testRoyalFlush, cardsToDeal, numRepeat);
    return console.log(`\n
        -- Dealing until a match is found using ${ruleset.name} -- \n 
        ---  Cards Dealt: ${cardsToDeal} - Matches Tested: ${numRepeat} --- \n
        =================================
        Match Type : Odds of Occurence
        =================================\n
        Straight: 1 in ${straightAverage} \n
        Flush: 1 in ${flushAverage} \n
        Straight Flush: 1 in ${straightFlushAverage} \n
        Royal Flush: 1 in ${royalFlushAverage} \n
        =================================
        =================================\n
    `);
}
printAllOdds(stDeck,PokerRules,7,50);

const printNumHandTest = function(deck:Deck,ruleset:Ruleset,cardsToDeal:number,numHands:number) {
    let testRes = dealAndTestNumHands(deck,ruleset,cardsToDeal,numHands);
    return console.log(`
    -- Dealing then testing hands using ${ruleset.name} -- \n
    --- Cards Dealt: ${cardsToDeal} -- Hands Dealt: ${numHands} --- \n
    =================================
    Match Type : Times Matched
    =================================\n
    Straight: ${testRes.straight} (${((testRes.straight/numHands)*100).toFixed(4)}%)\n
    Flush: ${testRes.flush} (${((testRes.flush/numHands)*100).toFixed(4)}%)\n
    Straight Flush: ${testRes.straightFlush} (${((testRes.straightFlush/numHands)*100).toFixed(4)}%)\n
    Royal Flush: ${testRes.royalFlush} (${((testRes.royalFlush/numHands)*100).toFixed(4)}%)\n
    =================================
    =================================\n
    `);
}
printNumHandTest(stDeck,PokerRules,7,100000);
