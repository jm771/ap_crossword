import React from 'react';
import ReactDOM from 'react-dom';
import RandomizerGame from './components/Randomizer/RandomizerGame';
import {GameJson} from './shared/types';


const mockGame: GameJson = {
  info: {
    title: 'Test Puzzle',
    author: 'Test Author',
    copyright: '',
    description: 'A test puzzle for the randomizer',
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
      <RandomizerGame slotdata= client= gameModel={mockGameModel} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

render();
