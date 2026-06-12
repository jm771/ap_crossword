import {RewardsState, clue_id_to_string, clue_id_to_loc_id} from '../shared/types';
import {Box} from '@mui/material';
import { ClientHandler } from '../archipelago_client_handler';
import { ClueCard } from './ClueCard';

// Remove?
interface RandomizerGameProps {
  client: ClientHandler,
  rewards: RewardsState,
  visitedLocations: Set<number>,
}

class DefaultMap<K, V> extends Map<K, V> {
  constructor(private createDefault: () => V) {
    super();
  }

  getOrCreate(key: K): V {
    if (!this.has(key)) {
      this.set(key, this.createDefault());
    }

    return this.get(key)!;
  }
}





export function RandomizerGame({client, rewards, visitedLocations}: RandomizerGameProps)
{
    const slotdata = client.getSlotData();
    const nCrossLetters = Math.floor(slotdata.cross_letters_per_reward * rewards.nCrossLetterRewards);
    const nRevealedClues = slotdata.n_starting_clues + Math.floor(slotdata.clues_per_reward * rewards.nClueRewards);
    const revealedLetterIndicies = new DefaultMap<string, number[]>(() => []);
    slotdata.cross_letters.slice(0, nCrossLetters).forEach(cl => {
      revealedLetterIndicies.getOrCreate(clue_id_to_string(cl.clue_id)).push(cl.index);
    });

    return (
        <Box className="clues-container" p={2}>
          {slotdata.clues.map((clue, index) => {
            const isSolved = visitedLocations.has(clue_id_to_loc_id(clue));
            const isUncensored = index < nRevealedClues;
            const clueIdStr = clue_id_to_string(clue);
            const lettersForClue = revealedLetterIndicies.getOrCreate(clueIdStr);

              return (<ClueCard key={clueIdStr} client={client} clue={clue} isSolved={isSolved} isUncensored={isUncensored} revealedLetters={lettersForClue}/>)
          })}
        </Box>
    );
}
