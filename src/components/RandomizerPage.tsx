
import { useEffect, useState } from "react";
import { ClientHandler } from "../archipelago_client_handler";
import RandomizerConfig, { DEFAULT_RANDOMIZER_CONFIG, RandomizerConfigState } from "./Randomizer/RandomizerConfig";
import { ClueId, RewardsState, SlotData } from "../shared/types";
import React from "react";
import { RandomizerGame } from "./Randomizer/RandomizerGame";
import { GameHeader } from "./GameHeader";

// Heres'a good place to pick up
  export function RandomizerPage() {
    const [configOpen, setConfigOpen] = useState<boolean>(true);
    // TODO save config into cookies
    const [config, setConfig] = useState<RandomizerConfigState>(DEFAULT_RANDOMIZER_CONFIG);
    const [client, setClient] = useState<ClientHandler | null>(null);
    const [visitedLocations, setVisitedLocations] = useState<Set<number>>(new Set());
    const [rewardState, setRewardState] = useState<RewardsState>({
        sequenceNo: 0,
        nClueRewards: 0,
        nCrossLetterRewards: 0
    });

    useEffect(() => {
        if (config === null) return;
        const newClient = new ClientHandler(
            setRewardState,
            setVisitedLocations
        );

        newClient.login(config.archipelagoUrl,
            config.slotName,
            () => setClient(newClient));

        return () => newClient.disconnect()
    },
    [config])

    console.log(visitedLocations);

    return (
    <React.StrictMode>
        <div className="randomizer-game">
        <RandomizerConfig
          open={configOpen}
          onClose={() => setConfigOpen(false)}
          onSave={setConfig}
          initialConfig={config}
        />
         <GameHeader handleOpenConfig={() => setConfigOpen(true) }/>
         {client && ( <RandomizerGame client={client} rewards={rewardState} visitedLocations={visitedLocations}/>)}
         </div>
        </React.StrictMode>
        );
    }