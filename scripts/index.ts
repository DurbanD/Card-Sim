import {Deck} from './Deck';
import {PokerRuleset} from './Poker';
import {Game} from './Game';
import {Player} from './Player';
import {Card} from './Card'
import { Ruleset, testResult } from './Ruleset';

const gameDeck = new Deck();
const P1 = new Player('Courtney');
const currentGame = new Game(gameDeck, PokerRuleset,[P1]);
currentGame.addPlayer(new Player('Ashley'));
currentGame.addPlayer(new Player('Andrew'));

let Holdem = currentGame.play();

const logGameResult = ( game: {players:Player[], river:Card[], win?:{player:Player|null, hand:Card[]|null, test:testResult|null}, any?:any} ) : void => {
    let players = game.players,
        river = game.river;
    if (!players || !river) return;

    console.log('\n--------------\nStarting Hands\n--------------');
    players.forEach(P=> {console.log(`\n${P.name} : `); P.hand.cards.forEach(c=>console.log(`${c.val} of ${c.suite}`))});

    console.log('\n~~~~~~~~~~~\n   River\n~~~~~~~~~~~\n');
    river.forEach(c=>console.log(`${c.val} of ${c.suite}`));

    console.log(`\n+++++++++++++\nMatch Results\n+++++++++++++`);
    players.forEach(P=> { 
        console.log('\n', P.name, ' - ', P.hand.bestMatch?.matchType); 
        if (P.hand.bestMatch && P.hand.bestMatch.cardsMatched) P.hand.bestMatch.cardsMatched.forEach(C=> C.forEach(c=>console.log(`     ${c.val} of ${c.suite}`)));
        else if (P.hand.bestMatch?.highCard) console.log(`     ${P.hand.bestMatch?.highCard.val} of ${P.hand.bestMatch?.highCard?.suite}`);
    });

    console.log(`\n     Winner: ${game.win?.player?.name}!\n~-~-~  ${game.win?.test?.matchType}${game.win?.test?.needKicker === true ? ' (Kicker)' : ''}  ~-~-\n`);
    // console.log(Holdem.win);

    // let winIndex = PokerRuleset.bestMatch([])
}

logGameResult(Holdem);