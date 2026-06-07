import { Client, Item, JSONRecord } from "archipelago.js";
import {
  RewardsState,
  SlotData,
  ClueId,
  NotNull,
  LOCATION_OFFSET,
  MAX_N_CLUES,
  clue_id_to_loc_id,
} from "./shared/types";

function unused(_thing: any) {}

function UpdateRewards(
  state: RewardsState,
  items: Item[],
  index: number,
): RewardsState {
  if (!items || !items.length) {
    return state;
  }

  let { sequenceNo, nClueRewards, nCrossLetterRewards } = state;

  if (index > state.sequenceNo) {
    throw new Error("Sequence number gap please restart");
  }

  for (let i = state.sequenceNo - index; i < items.length; i++) {
    const item = items[i]; // Get the current item
    console.log(`Got item: ${item.toString()}`);
    if (item.toString() === "Clue Unlock") {
      nClueRewards++;
    } else if (item.toString() === "Cross Letter") {
      nCrossLetterRewards++;
    } else if (item.toString() === "Victory") {
      // do nothing
    } else {
      throw new Error("Unknown item");
    }
  }

  sequenceNo = index + items.length;

  return {
    sequenceNo,
    nClueRewards: nClueRewards,
    nCrossLetterRewards: nCrossLetterRewards,
  };
}

// Just the react set state type but not hard coupled
type setState<T> = (f: T | ((arg0: T) => T)) => void;

export function clueIdFromLocId(id: number): ClueId {
  const IS_DOWN_SPLIT = 10 * 1000;
  return {
    direction: id >= IS_DOWN_SPLIT ? "Down" : "Across",
    number: id % IS_DOWN_SPLIT,
  };
}

export class ClientHandler {
  private client: Client;
  private setRewardState: setState<RewardsState>;
  private setFoundLocations: setState<Set<number>>;
  private slotData: SlotData | null;
  private errorCallback: (arg: string) => void;

  constructor(
    setRewardState: setState<RewardsState>,
    setFoundLocations: setState<Set<number>>,
    errorCallback: (arg: string) => void,
  ) {
    const client = new Client();
    this.setRewardState = setRewardState;
    this.setFoundLocations = setFoundLocations;
    this.errorCallback = errorCallback;
    this.slotData = null;

    client.items.on("itemsReceived", this.receiveditemsListener);
    client.room.on("locationsChecked", this.locationsCheckedListener);
    client.socket.on("disconnected", this.disconnectedListener);
    client.socket.on("bounced", this.bouncedListener);

    // client.messages.on('message', jsonListener);
    // client.deathLink.on('deathReceived', deathListener);

    this.client = client;
  }

  login(
    archipelagoUrl: string,
    slotName: string,
    password: string,
    callback: () => void,
  ) {
    this.client
      .login(archipelagoUrl, slotName, "Crossword", { password })
      .then((slotData: JSONRecord) => {
        this.slotData = slotData as unknown as SlotData;
        console.log("Connected to the Archipelago server!");
        callback();
      })
      .catch((e) => this.errorCallback(`${e}`));
  }

  locationsCheckedListener = (locations: number[]) => {
    this.setFoundLocations((old) => {
      const newSet = new Set(old);
      locations.forEach((x) => {
        if (x <= LOCATION_OFFSET + MAX_N_CLUES) {
          newSet.add(x);
        }
      });

      if (
        newSet.size >= (this.slotData?.clues?.length ?? LOCATION_OFFSET * 10)
      ) {
        this.client.goal();
      }

      return newSet;
    });
  };

  disconnect() {
    this.client.socket.disconnect();
  }

  disconnectedListener = () => {
    this.errorCallback("disconnected from archipalego");
  };

  bouncedListener = (packet: any) => {
    unused(packet);
    this.errorCallback("bounced from archipelago");
  };

  receiveditemsListener = (items: Item[], index: number) => {
    this.setRewardState((rewardState: RewardsState) => {
      const newState = UpdateRewards(rewardState, items, index);
      console.log(rewardState);

      if (newState.sequenceNo > rewardState.sequenceNo) {
        console.log(`New State ${JSON.stringify(newState)}`);
        return newState;
      } else {
        return rewardState;
      }
    });
  };

  solveClue(clue_id: ClueId) {
    const i = clue_id_to_loc_id(clue_id);
    console.log(`sending check ${i}`);
    try {
      this.client.check(i);
    } catch (e) {
      this.errorCallback(`${e}`);
    }
  }

  getSlotData(): SlotData {
    return NotNull(this.slotData);
  }
}
