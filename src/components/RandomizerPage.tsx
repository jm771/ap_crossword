import { useEffect, useState } from "react";
import { clientStatuses } from "../archipelago";
import { ClientHandler } from "../archipelago_client_handler";
import RandomizerConfig from "./Randomizer/RandomizerConfig";
import { RewardsState } from "../shared/types";

  export function RandomizerPage() {
    const [client, setClient] = useState<ClientHandler | null>(null);
    const [config, setConfig] = useState<RandomizerConfig | null>(null);

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

        return 
    },
    [config])
  }
  
  componentDidMount() {

    const config = this.getConfig();
    this.handler = new ClientHandler(
      this.props.gameModel,

      config.nLocations
    );
  }