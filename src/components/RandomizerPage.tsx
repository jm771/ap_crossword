
import { useEffect, useState } from "react";
import { ClientHandler } from "../archipelago_client_handler";
import RandomizerConfigDialog, { DEFAULT_RANDOMIZER_CONFIG, RandomizerConfig } from "./Randomizer/RandomizerConfig";
import { ClueId, RewardsState, SlotData } from "../shared/types";
import React from "react";
import { RandomizerGame } from "./Randomizer/RandomizerGame";
import { GameHeader } from "./GameHeader";

// Heres'a good place to pick up
  export function RandomizerPage() {
    const [configOpen, setConfigOpen] = useState<boolean>(true);
    // TODO save config into cookies
    const [config, setConfig] = useState<RandomizerConfig>(DEFAULT_RANDOMIZER_CONFIG);
    const [client, setClient] = useState<ClientHandler | null>(null);
    const [visitedLocations, setVisitedLocations] = useState<Set<number>>(new Set());
    const [rewardState, setRewardState] = useState<RewardsState>({
        sequenceNo: 0,
        nClueRewards: 0,
        nCrossLetterRewards: 0
    });
    const [connectionMessage, setConnectionMessage] = useState<string>("");

    useEffect(() => {
        if (config === null) return;
        const newClient = new ClientHandler(
            setRewardState,
            setVisitedLocations
        );

        newClient.login(config.archipelagoUrl,
            config.slotName,
            (success, error) => {
                if (success) {
                    setClient(newClient);
                    setConnectionMessage("Connected!");
                } else {
                    setConnectionMessage(`${error}`);
                }
            });

        return () => newClient.disconnect()
    },
    [config])

    return (
    <React.StrictMode>
        <div className="randomizer-game">
        <RandomizerConfigDialog
          open={configOpen}
          onClose={() => setConfigOpen(false)}
          onSave={setConfig}
          connectionMessage={connectionMessage}
        />
         <GameHeader handleOpenConfig={() => setConfigOpen(true) }/>
         {client && ( <RandomizerGame client={client} rewards={rewardState} visitedLocations={visitedLocations}/>)}
         </div>
        </React.StrictMode>
        );
    }