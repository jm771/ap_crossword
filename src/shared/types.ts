export type RewardsState = {
  sequenceNo: number;
  nKey: number;
  nNonKey: number;
};

export type RandomizerConfigJson = {
  slotName: string;
  archipelagoUrl: string;
  nLocations: number;
  nKeyItems: number;
  nNonKeyItems: number;
  minStartingClues: number;
  startingCluesProportion: number;
  nKeyForAllRevealProportion: number;
};

export type RandomizerStateJson = {
  solvedClues: {[clueId: string]: boolean};
  rewardState: RewardsState;
  wrongAttempts: {[clueId: string]: number};
  totalWrongAttempts: number;
  nLocations: number;
  config?: RandomizerConfigJson;
};

export interface GameJson {
  randomizer?: RandomizerStateJson;
}

export type Direction = "Across" | "Down"

export interface ClueId {
  direction: Direction
  number: number
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