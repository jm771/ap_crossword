import { Client, ConnectedPacket, JSONRecord } from "archipelago.js";
import { RewardsState, GameModel, SlotData, ClueId, NotNull } from "./shared/types";

function unused(thing: any) {}

function UpdateRewards(state: RewardsState, items: any[], index: number): RewardsState {
  if (!items || !items.length) {
    return state;
  }

  let {sequenceNo, nClueRewards, nCrossLetterRewards} = state;

  if (index > state.sequenceNo) {
    throw new Error("Sequence number gap please restart")
  }

  for (let i = state.sequenceNo - index; i < items.length; i++) {
    const item = items[i]; // Get the current item
    console.log(`Got item: ${item.toString()}`);
    if (item.toString() === 'Clue Unlock') {
      nClueRewards++;
    } else if (item.toString() === 'Cross Letter') {
      nCrossLetterRewards++;
    } else if (item.toString() === 'Victory') {
      // do nothing
    } else {
      throw new Error("Unknown item")
    }
  }

  sequenceNo = index + items.length;

  return {sequenceNo, nClueRewards: nClueRewards, nCrossLetterRewards: nCrossLetterRewards};
}

// Just the react set state type but not hard coupled
type setState<T> = (f: T | ((arg0: T) => T)) => void;


function cludeIdFromLocId(id: number): ClueId {
    const IS_DOWN_SPLIT = 10 * 1000;
  return {
      direction: id >= IS_DOWN_SPLIT ? "Down" : "Across",
      number: id % IS_DOWN_SPLIT
  }
}



export class ClientHandler {
  private client: Client;
  private setRewardState: setState<RewardsState>;
  private setSolvedClues: setState<ClueId[]>;
  private slotData: SlotData | null;
  // private onConnectItemUnlock: number;

  constructor(
    setRewardState: setState<RewardsState>,
    setSolvedClues: setState<ClueId[]>){
    const client = new Client();
    this.setRewardState = setRewardState;
    this.setSolvedClues = setSolvedClues
    

    client.items.on('itemsReceived', this.receiveditemsListener);
    client.room.on('locationsChecked', this.locationsCheckedListener)
    client.socket.on('disconnected', this.disconnectedListener);
    client.socket.on('bounced', this.bouncedListener);

    // client.messages.on('message', jsonListener);
    // client.deathLink.on('deathReceived', deathListener);

    this.client = client;
    // client.storage
    // TODO
    //client.scout... or check?
  }

  login(archipelagoUrl: string, slotName: string, callback: () => void) {
       this.client
      .login(archipelagoUrl, slotName, 'Crossword', undefined)
      .then((slotData: JSONRecord) => {
        this.slotData = slotData;
        console.log('Connected to the Archipelago server!');
      })
      .catch(console.error);

  }

  locationsCheckedListener = (locations: number[]) => {
    const cluesSolved = locations.map(cludeIdFromLocId)
    this.setSolvedClues(cluesSolved);
  }

  disconnect() {
    this.client.socket.disconnect();
  }

  disconnectedListener = () => {
    console.log('disconnected from archipalego');
  };

  bouncedListener = (packet: any) => {
    unused(packet);
    console.log('bounced from archipalego');
  };

  receiveditemsListener = (items: any, index: number) => {
    console.log('ReceivedItems packet: ', items, index);

    this.setRewardState((rewardState: RewardsState) => {
        const newState = UpdateRewards(rewardState, items, index);

        if (newState.sequenceNo > rewardState.sequenceNo) {
            console.log(`New State ${JSON.stringify(newState)}`);
            return newState;
        } else {
            return rewardState;
        }
    });
  };

  solveClue(clue_id: ClueId) {
    console.log(`sending check ${i}`);
    this.client.check(i);

    if (i >= this.nLocations) {
      this.client.goal();
    }
  }

  getSlotData(): SlotData {
    return NotNull(this.slotData);
  }
}

export function makeConnectClient(archipelagoUrl: string, slotName: string, callback: setState<ClientHandler>): void
{
  
}