**Deck of Cards Simulator**
===========================

This program is designed to simulate played card hands and return various odds for each match for a given ruleset. The class Deck creates a deck of Card objects, which is able to be dealt and hashed through as defined by a Ruleset.  Currently the Poker rulset is the only one available, which is responsible for checking "hands" of cards (Arrays). Simulating played matches in different environments will hopefully allow the user to gather a better insight into the odds of various card hands, and how they change in a given situation. 

Classes and Their Uses:
-----------------------
_Deck_ - Contains an array of _Card_ objects. Can init as a standard 52 _card_ deck or add/remove specific _Card_s as needed. Deals happen from the deck. Used by Games and Rulesets

_Card_ - Has a value and a suite. Used by _Decks_ and _Players_, analyzed by Rulesets

_Ruleset_ - Contains the checks for various hands as well as their priority

_Game_ - Takes a _Deck_ and _Rulset_ to generate games for _Players_

_Player_ - Will have a name, a hand containing _Cards_ and can participate in _Games_;
