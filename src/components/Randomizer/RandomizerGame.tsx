/* eslint-disable max-classes-per-file */
/* eslint-disable */
import React, {Component} from 'react';
import {GameJson, RandomizerStateJson, RewardsState, RandomizerConfigJson} from '../../shared/types';
import {Paper, TextField, Button, Typography, Box, Chip} from '@mui/material';
import {MdCheckCircle, MdCancel, MdSettings} from 'react-icons/md';
import './RandomizerGame.css';
import {Client} from '../../archipelago.js';
import RandomizerConfig, {RandomizerConfigState, DEFAULT_RANDOMIZER_CONFIG} from './RandomizerConfig';

function unused(thing: any) {}

type RewardLetter = {clueId: string; letterIndex: number};

interface ClueData {
  id: string; // e.g., "across-5" or "down-12"
  direction: 'across' | 'down';
  number: number;
  text: string;
  answer: string; // The correct answer from solution
  cells: {r: number; c: number}[]; // Grid positions for this clue
}

interface RandomizerState {
  clues: ClueData[];
  shuffledClues: ClueData[];
  answers: {[clueId: string]: string}; // User's current answer for each clue (local only)
  feedbackClue: string | null; // Which clue is showing feedback
  feedbackType: 'correct' | 'incorrect' | null;
  rewardAllocations: RewardLetter[];
  configDialogOpen: boolean;
}

interface RandomizerGameProps {
  game: GameJson;
  gid: string;
  gameModel: any; // The GameModel instance for syncing state
}

type GameModel = {
  randomizerSubmitAnswer: (clueId: string, isCorrect: boolean) => {};
  randomizerGetRewards: (state: RewardsState) => {};
  randomizerUpdateConfig: (config: RandomizerConfigJson) => {};
};

function UpdateRewards(state: RewardsState, items: any[], index: number): RewardsState | null {
  if (!items || !items.length) {
    return state;
  }

  let {sequenceNo, nKey, nNonKey} = state;

  if (index > state.sequenceNo) {
    alert('Sequence number gap please restart');
    return null;
  }

  for (let i = state.sequenceNo - index; i < items.length; i++) {
    const item = items[i]; // Get the current item
    console.log(`Got item: ${item.toString()}`);
    if (item.toString() === 'Key Crossword Item') {
      nKey++;
    } else if (item.toString() === 'Non-Key Crossword Item') {
      nNonKey++;
    }
  }

  sequenceNo = index + items.length;

  return {sequenceNo, nKey, nNonKey};
}

class ClientHandler {
  private client: any;
  private rewardState: RewardsState;
  private gameUpdateHandler: GameModel;
  private connected: boolean;
  private onConnectItemUnlock: number;
  private nLocations: number;

  constructor(gameUpdateHandler: GameModel, archipelagoUrl: string, slotName: string, nLocations: number) {
    const client = new Client(null);
    this.gameUpdateHandler = gameUpdateHandler;

    client.items.on('itemsReceived', this.receiveditemsListener);
    client.socket.on('connected', this.connectedListener);
    client.socket.on('disconnected', this.disconnectedListener);
    client.socket.on('bounced', this.bouncedListener);

    // client.messages.on('message', jsonListener);
    // client.deathLink.on('deathReceived', deathListener);

    this.client = client;
    this.connected = false;
    this.onConnectItemUnlock = 0;
    this.rewardState = {sequenceNo: 0, nKey: 0, nNonKey: 0};
    this.nLocations = nLocations;

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
    const newState = UpdateRewards(this.rewardState, items, index);

    if (newState && newState.sequenceNo > this.rewardState.sequenceNo) {
      console.log(`New State ${JSON.stringify(newState)}`);
      this.rewardState = newState;
      this.gameUpdateHandler.randomizerGetRewards(newState);
    }
  };

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

export default class RandomizerGame extends Component<RandomizerGameProps, RandomizerState> {
  handler: ClientHandler | null;

  constructor(props: RandomizerGameProps) {
    super(props);

    this.handler = null;

    const clues = this.extractClues();
    const rng = new SeededRandom(this.hashString(props.gid));
    const shuffledClues = this.shuffleArray([...clues], rng);
    const rewardAllocations = this.calculateRewardAllocations(clues, rng);

    // Check URL params for openConfig flag (used when navigating from mode selection)
    const urlParams = new URLSearchParams(window.location.search);
    const shouldOpenConfig = urlParams.get('openConfig') === '1';
    const hasConfig = !!this.randomizerState.config;

    this.state = {
      clues,
      shuffledClues,
      answers: {},
      feedbackClue: null,
      feedbackType: null,
      rewardAllocations,
      configDialogOpen: shouldOpenConfig && !hasConfig,
    };
  }

  componentDidMount() {
    // Remove openConfig param from URL so refresh doesn't reopen dialog
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('openConfig')) {
      urlParams.delete('openConfig');
      const newSearch = urlParams.toString();
      const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '');
      window.history.replaceState({}, '', newUrl);
    }

    const config = this.getConfig();
    this.handler = new ClientHandler(
      this.props.gameModel,
      config.archipelagoUrl,
      config.slotName,
      config.nLocations
    );
  }

  componentDidUpdate(prevProps: RandomizerGameProps) {
    const prevConfig = prevProps?.game?.randomizer?.config;
    const newConfig = this.props?.game?.randomizer?.config;

    // Update handler config if it changed
    if (prevConfig !== newConfig && newConfig && this.handler) {
      this.handler = new ClientHandler(
        this.props.gameModel,
        newConfig.archipelagoUrl,
        newConfig.slotName,
        newConfig.nLocations
      );
    }

    const prevLocations = prevProps?.game?.randomizer?.nLocations || 0;
    const newLocations = this.props?.game?.randomizer?.nLocations || 0;
    for (let i = prevLocations + 1; i <= newLocations; i++) {
      this.handler?.solveClueBundle(i);
    }
  }

  // Get randomizer state from game (synced across all players)
  get randomizerState(): RandomizerStateJson {
    return (
      this.props.game.randomizer || {
        solvedClues: {},
        rewardState: {sequenceNo: 0, nKey: 0, nNonKey: 0},
        wrongAttempts: {},
        totalWrongAttempts: 0,
        nLocations: 0,
      }
    );
  }

  // Get config with defaults
  getConfig(): RandomizerConfigJson {
    return this.randomizerState.config || DEFAULT_RANDOMIZER_CONFIG;
  }

  handleOpenConfig = () => {
    this.setState({configDialogOpen: true});
  };

  handleCloseConfig = () => {
    this.setState({configDialogOpen: false});
  };

  handleSaveConfig = (config: RandomizerConfigState) => {
    this.props.gameModel.randomizerUpdateConfig(config);
  };

  // Hash a string to get a consistent seed
  hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  // Shuffle array with seeded random
  shuffleArray<T>(array: T[], rng: SeededRandom): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(rng.next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Extract all clues from the game
  extractClues(): ClueData[] {
    const {game} = this.props;
    const clues: ClueData[] = [];
    const {grid, solution, clues: gameClues} = game;

    // Build a map of cell positions for each clue number and direction
    const cluePositions: {
      [key: string]: {r: number; c: number}[];
    } = {};

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const cell = grid[r][c];
        if (cell && !cell.black && cell.parents) {
          ['across', 'down'].forEach((dir) => {
            const direction = dir as 'across' | 'down';
            const number = cell.parents![direction];
            if (number) {
              const key = `${direction}-${number}`;
              if (!cluePositions[key]) {
                cluePositions[key] = [];
              }
              cluePositions[key].push({r, c});
            }
          });
        }
      }
    }

    // Build clue objects
    ['across', 'down'].forEach((dir) => {
      const direction = dir as 'across' | 'down';
      gameClues[direction].forEach((text, number) => {
        if (text) {
          const key = `${direction}-${number}`;
          const cells = cluePositions[key] || [];
          const answer = cells.map(({r, c}) => solution[r][c]).join('');

          clues.push({
            id: key,
            direction,
            number,
            text,
            answer,
            cells,
          });
        }
      });
    });

    return clues;
  }

  // Calculate which rewards (letter reveals) each clue unlocks
  calculateRewardAllocations(clues: ClueData[], rng: SeededRandom): RewardLetter[] {
    // Build a list of all possible rewards (each crossed letter)
    const allRewards: RewardLetter[] = [];

    clues.forEach((clue) => {
      clue.cells.forEach((cell, index) => {
        // Find the crossing clue
        const crossingClue = clues.find((otherClue) => {
          if (otherClue.direction === clue.direction) return false;
          return otherClue.cells.some((otherCell) => otherCell.r === cell.r && otherCell.c === cell.c);
        });

        if (crossingClue) {
          // This is a crossed letter, so it's a potential reward
          allRewards.push({clueId: clue.id, letterIndex: index});
        }
      });
    });

    // Shuffle all rewards
    return this.shuffleArray(allRewards, rng);
  }

  handleAnswerChange = (clueId: string, value: string) => {
    this.setState((state) => ({
      answers: {
        ...state.answers,
        [clueId]: value.toUpperCase(),
      },
    }));
  };

  handleSubmit = (clue: ClueData) => {
    const {answers} = this.state;
    const userAnswer = (answers[clue.id] || '').toUpperCase().trim();
    const correctAnswer = clue.answer.toUpperCase().trim();

    const {solvedClues} = this.randomizerState;
    if (solvedClues[clue.id]) {
      // Already solved, don't process
      return;
    }

    const isCorrect = userAnswer === correctAnswer;

    this.props.gameModel.randomizerSubmitAnswer(clue.id, isCorrect);
    // Show feedback
    this.setState({
      feedbackClue: clue.id,
      feedbackType: isCorrect ? 'correct' : 'incorrect',
    });

    setTimeout(() => {
      this.setState({feedbackClue: null, feedbackType: null});
    }, 2000);
  };

  handleForceSolve = (clue: ClueData) => {
    const {solvedClues} = this.randomizerState;
    if (solvedClues[clue.id]) {
      // Already solved, don't process
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to force solve this clue?`);

    if (confirmed) {
      this.props.gameModel.randomizerSubmitAnswer(clue.id, true);
      // Show feedback
      this.setState({
        feedbackClue: clue.id,
        feedbackType: 'correct',
      });

      setTimeout(() => {
        this.setState({feedbackClue: null, feedbackType: null});
      }, 2000);
    }
  };

  renderAnswerBox(clue: ClueData, revealedLetters: {[clueId: string]: number[]}) {
    const {answers, feedbackClue, feedbackType} = this.state;
    const {solvedClues} = this.randomizerState;
    const isSolved = solvedClues[clue.id];
    const revealed = revealedLetters[clue.id] || [];
    const showFeedback = feedbackClue === clue.id;

    const answer = isSolved ? clue.answer : answers[clue.id] || '';

    return (
      <Box className="answer-box">
        {clue.answer.split('').map((letter, index) => {
          const isRevealed = revealed.includes(index);
          const displayLetter = isSolved || isRevealed ? letter : answer[index] || '';

          return (
            <Box
              key={index}
              className={`letter-box ${isRevealed ? 'revealed' : ''} ${isSolved ? 'solved' : ''}`}
            >
              {displayLetter}
            </Box>
          );
        })}
        {showFeedback && (
          <Box className="feedback-icon">
            {feedbackType === 'correct' ? (
              <MdCheckCircle style={{color: 'green', fontSize: 32}} />
            ) : (
              <MdCancel style={{color: 'red', fontSize: 32}} />
            )}
          </Box>
        )}
      </Box>
    );
  }

  render() {
    const config = this.getConfig();
    const {
      nKeyItems: N_KEY_ITEMS,
      nNonKeyItems: N_NON_KEY_ITEMS,
      minStartingClues: MIN_STARTING_CLUES,
      startingCluesProportion: STARTING_CLUES_PROPORTION,
      nKeyForAllRevealProportion: N_KEY_FOR_ALL_REVEAL_PROPORTION,
    } = config;

    const {shuffledClues, answers, rewardAllocations, configDialogOpen} = this.state;
    const {solvedClues, wrongAttempts, totalWrongAttempts, rewardState} = this.randomizerState;
    console.log(`Rendering with rewardState=${JSON.stringify(rewardState)}`);
    const totalClues = shuffledClues.length;
    const solvedCount = Object.keys(solvedClues).filter((id) => solvedClues[id]).length;
    const {nNonKey, nKey} = rewardState;

    const freebies = Math.max(MIN_STARTING_CLUES, Math.ceil(totalClues * STARTING_CLUES_PROPORTION));
    const nRevealed =
      freebies +
      Math.floor(((totalClues - freebies) * nKey) / (N_KEY_ITEMS * N_KEY_FOR_ALL_REVEAL_PROPORTION));

    let revealedLetters: {[clueId: string]: number[]} = {};
    const nRecievedLetters = Math.floor((rewardAllocations.length * nNonKey) / N_NON_KEY_ITEMS);

    for (let i = 0; i < nRecievedLetters; i++) {
      let {clueId, letterIndex} = rewardAllocations[i];
      if (!revealedLetters[clueId]) {
        revealedLetters[clueId] = [];
      }

      revealedLetters[clueId].push(letterIndex);
    }

    return (
      <div className="randomizer-game">
        <RandomizerConfig
          open={configDialogOpen}
          onClose={this.handleCloseConfig}
          onSave={this.handleSaveConfig}
          initialConfig={config}
        />
        <Box className="randomizer-header" p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Crossword Randomizer</Typography>
            <Box display="flex" style={{gap: '8px'}}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<MdSettings />}
                onClick={this.handleOpenConfig}
              >
                Config
              </Button>
            </Box>
          </Box>
          <Box display="flex" style={{gap: '16px', marginTop: '16px'}}>
            <Chip label={`Solved: ${solvedCount} / ${totalClues}`} color="primary" />
            <Chip label={`Wrong Attempts: ${totalWrongAttempts}`} color="secondary" />
          </Box>
          <Typography variant="body2" color="textSecondary" style={{marginTop: '8px'}}>
            Solve clues to earn letter reveals in other clues. Clues are in random order.
          </Typography>
        </Box>

        <Box className="clues-container" p={2}>
          {shuffledClues.map((clue, index) => {
            const isSolved = solvedClues[clue.id];
            const attempts = wrongAttempts[clue.id] || 0;
            const isRevealed = index < nRevealed;
            const clasified = '█';
            const halfLength = clue.text.length >> 1;
            const censoredClue = isRevealed
              ? clue.text
              : clue.text.substring(0, halfLength) + clasified.repeat((clue.text.length - halfLength) >> 1);

            return (
              <Paper key={clue.id} className="clue-card" elevation={2}>
                <Box p={2}>
                  <Typography variant="body1" className="clue-text">
                    {censoredClue}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {isRevealed && (
                      <>
                        {' '}
                        {clue.direction}
                        {' clue'}
                      </>
                    )}
                    {attempts > 0 && ` • ${attempts} wrong attempt${attempts > 1 ? 's' : ''}`}
                  </Typography>

                  {this.renderAnswerBox(clue, revealedLetters)}

                  {!isSolved && (
                    <Box display="flex" style={{marginTop: '16px', gap: '8px'}}>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="Enter answer"
                        value={answers[clue.id] || ''}
                        onChange={(e) => this.handleAnswerChange(clue.id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            this.handleSubmit(clue);
                          }
                        }}
                        disabled={isSolved}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.handleSubmit(clue)}
                        disabled={isSolved || !answers[clue.id]}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => this.handleForceSolve(clue)}
                        disabled={isSolved}
                      >
                        Force
                      </Button>
                    </Box>
                  )}
                </Box>
              </Paper>
            );
          })}
        </Box>
      </div>
    );
  }
}
