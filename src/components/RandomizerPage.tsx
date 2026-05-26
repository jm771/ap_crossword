
import { useEffect, useState } from "react";
import { ClientHandler } from "../archipelago_client_handler";
import { RandomizerConfigState } from "./Randomizer/RandomizerConfig";
import { ClueId, RewardsState, SlotData } from "../shared/types";
import React from "react";
import RandomizerGame from "./Randomizer/RandomizerGame";

// Heres'a good place to pick up
  export function RandomizerPage() {
    const [config, setConfig] = useState<RandomizerConfigState | null>(null);
    const [client, setClient] = useState<ClientHandler | null>(null);
    const [solvedClues, setSolvedClues] = useState<ClueId[]>([]);
    const [rewardState, setRewardState] = useState<RewardsState>({
        sequenceNo: 0,
        nClueRewards: 0,
        nCrossLetterRewards: 0
    });

    useEffect(() => {
        if (config === null) return;
        const newClient = new ClientHandler(
            setRewardState,
            setSolvedClues
        );

        newClient.login(config.archipelagoUrl,
            config.slotName,
            () => setClient(newClient));

        return () => newClient.disconnect()
    },
    [config])

    return (
    <React.StrictMode>
         {client && ( <RandomizerGame client={client} rewards={rewardState} solvedClues={solvedClues}/>)}
        </React.StrictMode>
        );
    }