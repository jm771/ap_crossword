import { Client } from "./archipelago";
import { RewardsState, GameModel } from "./shared/types";

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

type setState<T> = (f: (arg0: T) => T) => void;



export class ClientHandler {
  private client: any;
  private setRewardState: setState<RewardsState>;
  private connected: boolean;
  private onConnectItemUnlock: number;

  constructor(archipelagoUrl: string, slotName: string, setRewardState: setState<RewardsState>){
    const client = new Client(null);
    this.setRewardState = setRewardState;

    client.items.on('itemsReceived', this.receiveditemsListener);
    client.socket.on('connected', this.connectedListener);
    client.socket.on('disconnected', this.disconnectedListener);
    client.socket.on('bounced', this.bouncedListener);

    // client.messages.on('message', jsonListener);
    // client.deathLink.on('deathReceived', deathListener);

    this.client = client;
    this.connected = false;
    this.onConnectItemUnlock = 0;

    this.client
      .login(archipelagoUrl, slotName, 'Crossword', undefined)
      .then(() => {
        console.log('Connected to the Archipelago server!');
        this.connected = true;
        if (this.onConnectItemUnlock) {
          this.solveClueBundle(this.onConnectItemUnlock);
        }
      })
      .catch(console.error);
  }
  connectedListener = (packet: any) => {
    // apstatus = "AP: Connected";

    // window.apseed = packet.slot_data.seed_name;
    // window.slot = packet.slot;

    console.log(packet);

    // I need to change the python to change this if I want to recieve it

    // const apworld = packet.slot_data.ap_world_version;
    // if (!apworld || ['0.0.0'].includes(apworld)) {
    //   alert('Wrong apworld version, expected 0.0.0, got ' + apworld);
    // } else {
    //   console.log('This apworld version should work', packet.slot_data.ap_world_version);
    // }
  };

  disconnectedListener = (packet: any) => {
    unused(packet);
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

  // TODO fix
  solveClueBundle(i: number) {
    if (this.connected) {
      console.log(`sending check ${i}`);
      this.client.check(i);

      if (i >= this.nLocations) {
        this.client.goal();
      }
    } else {
      this.onConnectItemUnlock = Math.max(this.onConnectItemUnlock, i);
    }
  }
}