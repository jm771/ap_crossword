import { useEffect, useState } from "react";
import { ClientHandler } from "../archipelago_client_handler";
import RandomizerConfigDialog, {
  getInitialConfigState,
  RandomizerConfig,
} from "./RandomizerConfig";
import { RewardsState } from "../shared/types";
import React from "react";
import { RandomizerGame } from "./RandomizerGame";
import { GameHeader } from "./GameHeader";

export function RandomizerPage() {
  const [config, setConfig] = useState<RandomizerConfig>(
    getInitialConfigState(),
  );
  const [configOpen, setConfigOpen] = useState<boolean>(!config.configSet);
  const [client, setClient] = useState<ClientHandler | null>(null);
  const [visitedLocations, setVisitedLocations] = useState<Set<number>>(
    new Set(),
  );
  const [rewardState, setRewardState] = useState<RewardsState>({
    sequenceNo: 0,
    nClueRewards: 0,
    nCrossLetterRewards: 0,
  });
  const [connectionMessage, setConnectionMessage] = useState<string>("");

  useEffect(() => {
    if (config === null) return;
    setRewardState({
      sequenceNo: 0,
      nClueRewards: 0,
      nCrossLetterRewards: 0,
    });
    setVisitedLocations(new Set());

    const newClient = new ClientHandler(
      setRewardState,
      setVisitedLocations,
      (message) => {
        setConnectionMessage(message);
        setConfigOpen(true);
      },
    );

    newClient.login(
      config.archipelagoUrl,
      config.slotName,
      config.password,
      () => {
        setClient(newClient);
        setConnectionMessage("Connected!");
      },
    );

    return () => newClient.disconnect();
  }, [config]);

  const totalClues = client?.getSlotData().clues.length ?? 0;

  return (
    <React.StrictMode>
      <div className="randomizer-game">
        <RandomizerConfigDialog
          open={configOpen}
          onClose={() => setConfigOpen(false)}
          onSave={setConfig}
          connectionMessage={connectionMessage}
        />
        <GameHeader
          totalClues={totalClues}
          solvedCount={visitedLocations.size}
          handleOpenConfig={() => setConfigOpen(true)}
        />
        {client && (
          <RandomizerGame
            client={client}
            rewards={rewardState}
            visitedLocations={visitedLocations}
          />
        )}
      </div>
    </React.StrictMode>
  );
}
