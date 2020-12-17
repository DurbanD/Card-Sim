***Deck of Cards Simulator

This program is designed to simulate played card hands and return various odds for each match for a given ruleset. The class Deck creates a deck of Card objects, which is able to be dealt and hashed through as defined by a Ruleset.  Currently the Poker rulset is the only one available, which is responsible for checking "hands" of cards (Arrays). Simulating played matches in different environments will hopefully allow the user to gather a better insight into the odds of various card hands, and how they change in a given situation. 


class Deck - Contains an array of Card objects as this.cards. Can init as a standard 52 card deck or add/remove specific Cards as needed. Deals happen from the deck.
class Card - Value and a Suite. Used by Decks, Hands, and Rulesets
class Ruleset - Contains the checks for various hands as well as their priority
class Game - Takes a Deck and Rulset to generate games for Players
class Player - Will have a Hand and participate in Games;
