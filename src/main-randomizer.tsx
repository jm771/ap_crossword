import React from 'react';
import ReactDOM from 'react-dom';
import RandomizerGame from './components/Randomizer/RandomizerGame';
import {GameJson} from './shared/types';

// Mock game data - a simple 5x5 crossword
const mockGame: GameJson = {
  info: {
    title: 'Test Puzzle',
    author: 'Test Author',
    copyright: '',
    description: 'A test puzzle for the randomizer',
  },
  grid: [
    [
      {value: '', number: 1, parents: {across: 1, down: 1}},
      {value: '', parents: {across: 1, down: 2}},
      {value: '', parents: {across: 1, down: 3}},
      {value: '', parents: {across: 1, down: 4}},
      {value: '', parents: {across: 1, down: 5}},
    ],
    [
      {value: '', number: 6, parents: {across: 6, down: 1}},
      {value: '', parents: {across: 6, down: 2}},
      {value: '', parents: {across: 6, down: 3}},
      {value: '', parents: {across: 6, down: 4}},
      {value: '', parents: {across: 6, down: 5}},
    ],
    [
      {value: '', number: 7, parents: {across: 7, down: 1}},
      {value: '', parents: {across: 7, down: 2}},
      {value: '', parents: {across: 7, down: 3}},
      {value: '', parents: {across: 7, down: 4}},
      {value: '', parents: {across: 7, down: 5}},
    ],
    [
      {value: '', number: 8, parents: {across: 8, down: 1}},
      {value: '', parents: {across: 8, down: 2}},
      {value: '', parents: {across: 8, down: 3}},
      {value: '', parents: {across: 8, down: 4}},
      {value: '', parents: {across: 8, down: 5}},
    ],
    [
      {value: '', number: 9, parents: {across: 9, down: 1}},
      {value: '', parents: {across: 9, down: 2}},
      {value: '', parents: {across: 9, down: 3}},
      {value: '', parents: {across: 9, down: 4}},
      {value: '', parents: {across: 9, down: 5}},
    ],
  ],
  solution: [
    ['H', 'E', 'L', 'L', 'O'],
    ['O', 'W', 'N', 'E', 'R'],
    ['U', 'N', 'I', 'T', 'Y'],
    ['S', 'E', 'E', 'D', 'S'],
    ['E', 'R', 'R', 'O', 'R'],
  ],
  clues: {
    across: [
      '', // 0
      'Greeting', // 1
      '', // 2
      '', // 3
      '', // 4
      '', // 5
      'Possessor', // 6
      'Togetherness', // 7
      'Plant starts', // 8
      'Mistake', // 9
    ],
    down: [
      '', // 0
      'Dwelling', // 1
      'Possesses', // 2
      'Network', // 3
      'Requirements', // 4
      'Year ending', // 5
    ],
  },
  randomizer: {
    solvedClues: {},
    rewardState: {sequenceNo: 0, nKey: 0, nNonKey: 0},
    wrongAttempts: {},
    totalWrongAttempts: 0,
    nLocations: 0,
  },
};

// Mock gameModel - no backend, just local state
const mockGameModel = {
  randomizerSubmitAnswer: (clueId: string, isCorrect: boolean) => {
    console.log(`Answer submitted for ${clueId}: ${isCorrect ? 'correct' : 'incorrect'}`);
    if (isCorrect) {
      mockGame.randomizer!.solvedClues[clueId] = true;
      mockGame.randomizer!.nLocations += 1;
    } else {
      mockGame.randomizer!.wrongAttempts[clueId] =
        (mockGame.randomizer!.wrongAttempts[clueId] || 0) + 1;
      mockGame.randomizer!.totalWrongAttempts += 1;
    }
    // Trigger re-render
    render();
  },
  randomizerGetRewards: (state: any) => {
    console.log('Rewards updated:', state);
    mockGame.randomizer!.rewardState = state;
    render();
  },
  randomizerUpdateConfig: (config: any) => {
    console.log('Config updated:', config);
    mockGame.randomizer!.config = config;
    render();
  },
};

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <RandomizerGame game={mockGame} gid="test-game" gameModel={mockGameModel} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

render();
