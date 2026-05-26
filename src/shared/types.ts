export type RewardsState = {
  sequenceNo: number;
  nClueRewards: number;
  nCrossLetterRewards: number;
};

// export type RandomizerConfigJson = {
//   slotName: string;
//   archipelagoUrl: string;
// };

// export type RandomizerStateJson = {
//   solvedClues: {[clueId: string]: boolean};
//   rewardState: RewardsState;
//   wrongAttempts: {[clueId: string]: number};
//   totalWrongAttempts: number;
//   nLocations: number;
//   config?: RandomizerConfigJson;
// };

// Todo = should put this on the slot data
export interface PuzzleInfo {
    title: string,
    author: string,
    copyright: string,
    description: string,
}

export interface GameJson {
  info: PuzzleInfo
  randomizer?: RandomizerStateJson;
}

export type Direction = "Across" | "Down"

export interface ClueId {
  direction: Direction
  number: number
}

export type ClueIdStr = string;

export function clue_id_to_string(clueId: ClueId): ClueIdStr {
  return `${clueId.direction}-${clueId.number}`
}

export interface Clue {
  direction: Direction
  number: number
  clue: string
  answer: string
}

export interface CrossLetter {
  clue_id: ClueId
  index: number
  value: string

}

export interface SlotData {
  n_starting_clues: number
  clues_per_reward: number
  cross_letters_per_reward: number
  clues: Clue[]
  cross_letters: CrossLetter[]
}

export interface RandomizerState {
  answers: {[clueId: string]: string}; // User's current answer for each clue (local only)
  feedbackClue: ClueId | null; // Which clue is showing feedback
  feedbackType: 'correct' | 'incorrect' | null;
}

// Remove?
export type GameModel = {
  // randomizerSubmitAnswer: (clueId: string, isCorrect: boolean) => {};
  randomizerGetRewards: (state: RewardsState) => {};
  // randomizerUpdateConfig: (config: RandomizerConfigJson) => {};
};