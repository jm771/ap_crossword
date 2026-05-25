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
