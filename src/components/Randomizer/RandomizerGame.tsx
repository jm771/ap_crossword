/* eslint-disable max-classes-per-file */
/* eslint-disable */
import React, {Component} from 'react';
import {GameJson, RandomizerStateJson, RewardsState, RandomizerConfigJson, RandomizerState, ClueData, SlotData, ClueId} from '../../shared/types';
import {Paper, TextField, Button, Typography, Box, Chip} from '@mui/material';
import {MdCheckCircle, MdCancel, MdSettings} from 'react-icons/md';
import './RandomizerGame.css';
import {Client} from '../../archipelago.js';
import RandomizerConfig, {RandomizerConfigState, DEFAULT_RANDOMIZER_CONFIG} from './RandomizerConfig';
import { ClientHandler } from '../../archipelago_client_handler.js';

// Remove?
interface RandomizerGameProps {
  client: ClientHandler,
  rewards: RewardsState,
  solvedClues: ClueId[],
}


export default class RandomizerGame extends Component<RandomizerGameProps, RandomizerState> {
  constructor(props: RandomizerGameProps) {
    super(props);

    this.state = {
      answers: {},
      feedbackClue: null,
      feedbackType: null,
    };
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

    const {answers, configDialogOpen} = this.state;
    const clues = this.props.slotdata.clues
    const {solvedClues, wrongAttempts, totalWrongAttempts, rewardState} = this.randomizerState;
    console.log(`Rendering with rewardState=${JSON.stringify(rewardState)}`);
    const totalClues = clues
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
    );
  }
}
