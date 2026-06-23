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
import TextClient from "../textClient/TextClient";
import styles from "./RandomizerPage.module.css";

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
  const [activePanel, setActivePanel] = useState<"game" | "chat">("game");
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [key, setKey] = useState<number>(0);

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

    setKey((x) => x + 1);
    return () => newClient.disconnect();
  }, [config]);

  const totalClues = client?.getSlotData().clues.length ?? 0;

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && activePanel === "game") {
      setActivePanel("chat");
    }
    if (isRightSwipe && activePanel === "chat") {
      setActivePanel("game");
    }
  };

  return (
    <React.StrictMode>
      <div className="randomizer-game" key={key}>
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
          <div
            className={styles.gameContainer}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Main game panel */}
            <div
              className={`${styles.gamePanel} ${activePanel === "game" ? styles.active : ""}`}
            >
              <RandomizerGame
                client={client}
                rewards={rewardState}
                visitedLocations={visitedLocations}
              />
            </div>

            {/* Text client panel - fixed on desktop, swipeable on mobile */}
            <div
              className={`${styles.chatPanel} ${activePanel === "chat" ? styles.active : ""}`}
            >
              <TextClient client={client.getClient()} />
            </div>

            {/* Mobile panel indicators */}
            <div className={styles.panelIndicators}>
              <button
                onClick={() => setActivePanel("game")}
                className={`${styles.panelButton} ${activePanel === "game" ? styles.active : ""}`}
              >
                Game
              </button>
              <button
                onClick={() => setActivePanel("chat")}
                className={`${styles.panelButton} ${activePanel === "chat" ? styles.active : ""}`}
              >
                Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </React.StrictMode>
  );
}
