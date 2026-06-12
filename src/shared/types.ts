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

export type Direction = "Across" | "Down"

export interface ClueId {
  direction: Direction
  number: number
}

export type ClueIdStr = string;

export function clue_id_to_string(clueId: ClueId): ClueIdStr {
  return `${clueId.direction}-${clueId.number}`
}

export const MAX_N_CLUES = 1000;
export const LOCATION_OFFSET = 10 * MAX_N_CLUES;

export function clue_id_to_loc_id(clueId: ClueId): number {
  return clueId.number + (clueId.direction == 'Down' ? LOCATION_OFFSET : 0);
}

export function clue_id_to_desc(clueId: ClueId): string {
  return `${clueId.number} ${clueId.direction}`
}

// export function loc_id_to_clue_id(locId: number): ClueId  {
//   return clueId.number + clueId.direction == 'down' ? LOCATION_OFFSET : 0;
// }

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

export function NotNull<T>(val : T | undefined | null): T {
  if (val == null) {
    throw Error("Value was null");
  }

  return val;
}