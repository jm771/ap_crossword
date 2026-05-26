
import { useEffect, useState } from "react";
import { clientStatuses } from "../archipelago";
import { ClientHandler } from "../archipelago_client_handler";
import { RandomizerConfigState } from "./Randomizer/RandomizerConfig";
import { RewardsState, SlotData } from "../shared/types";
import React from "react";
import RandomizerGame from "./Randomizer/RandomizerGame";

// Heres'a good place to pick up
  export function RandomizerPage() {
    const [client, setClient] = useState<ClientHandler | null>(null);
    const [config, setConfig] = useState<RandomizerConfigState | null>(null);
    const [slotData, setSlotData] = useState<SlotData | null>(null);

    const [rewardState, setRewardState] = useState<RewardsState>({
        sequenceNo: 0,
        nClueRewards: 0,
        nCrossLetterRewards: 0
    });

    useEffect(() => {
        if (config === null) return;
        const newClient = new ClientHandler(
            config.archipelagoUrl,
            config.slotName,
            setRewardState,
        )

        return () => newClient.disconnect()
    },
    [config])

    return (
    <React.StrictMode>
         {client && slotdata && ( <RandomizerGame client={client} slotdata={undefined} gameModel={undefined}  />)}
        </React.StrictMode>
        );
  
  
//   componentDidMount() {
//gameModel={mockGameModel}
//     const config = this.getConfig();
//     this.handler = new ClientHandler(
//       this.props.gameModel,

//       config.nLocations
//     );
//   }