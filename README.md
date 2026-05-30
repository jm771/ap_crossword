# An integration for crosswords in Archipelago

<img width="600" height="397" alt="image" src="https://github.com/user-attachments/assets/f25a74a9-d891-492f-ab96-a0aacbadf820" />

In a regular crossword - by solving an across clue, you "unlock" the knowledge of some cross letters in down clues
In this crossword randomizer the locations are solving clues, and the items are cross letters.
For that reason, the crossword grid is not visibile - the clues are presented in a list - else you'd get the cross letters for free.

Archipelago is more fun when you can't beat the game without rewards from the multiworld, so for that reason you don't start with all the clues available. Clues are also a randomizer item. However to allow for some "out of logic fun" - you can still see the first half of clues that not unlocked.

Part of the fun of crosswords is having a high quality crossword with great clues of a style you enjoy (American style, Cryptic, Easy, Hard) so the randomizer outsources the job of finding a good crossword to you.
As part of world generation you need to provide a `.puz` file containing the crossword you wish to randomize. Many crossword outlets provide .puz files as part of a subscription. Or you can use this excellent tool to download puz files from many popular outlets: https://github.com/thisisparker/xword-dl

## Setup
Download the latest apworld file from: https://github.com/jm771/apworld_crossword/releases/ and install it into archipelago
Update the sample yaml file with a pointer to your `.puz` file and generate and host a world
Use the website here: https://jm771.github.io/ap_crossword/ and connect to your archipelago world

### FAQ
"while parsing a quoted scalar did not find expected hexdecimal number"
In yaml strings in double quotes `"` treat backslashes `\` as escape sequences. Unfortunately windows "copy as path" triggers this - change your double quotes to single quotes `'`

### Feedback
The game is very new. I currently have some time to put into this - and am very open to any feedback that'd help make this easier to use or more fun for people to play. I'd prioritise that over my own ideas.

### Work in progress
- Add password to the archipelago login option
- Text client on the web interface
- Better visibility of what you're unlocking for people (in chat or banner)
- Track number of wrong guesses
- Rerender less of the UI on updates

### Maybe in the future?
- Deathlink
