/* eslint-disable max-classes-per-file */
/* eslint-disable */
import React, {Component, useState} from 'react';
import {GameJson, RandomizerStateJson, RewardsState, RandomizerConfigJson, RandomizerState, ClueData, SlotData, ClueId, ClueIdStr, clue_id_to_string, Clue, clue_to_id_string} from '../../shared/types';
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


// export default class RandomizerGame extends Component<RandomizerGameProps, RandomizerState> {
//   constructor(props: RandomizerGameProps) {
//     super(props);

//     this.state = {
//       answers: {},
//       feedbackClue: null,
//       feedbackType: null,
//     };
//   }

//   componentDidUpdate(prevProps: RandomizerGameProps) {
//     const prevConfig = prevProps?.game?.randomizer?.config;
//     const newConfig = this.props?.game?.randomizer?.config;

//     // Update handler config if it changed
//     if (prevConfig !== newConfig && newConfig && this.handler) {
//       this.handler = new ClientHandler(
//         this.props.gameModel,
//         newConfig.archipelagoUrl,
//         newConfig.slotName,
//         newConfig.nLocations
//       );
//     }

type Feedback = 'correct' | 'incorrect' | null;

function AnswerBox({clue,  isSolved, feedback, revealedLetters}:{clue: Clue, isSolved: boolean, feedback: Feedback, revealedLetters: number[]}) 
{
  // const {answers, feedbackClue, feedbackType} = this.state;
  // const {solvedClues} = this.randomizerState;
  // const isSolved = solvedClues[clue.id];
  // const revealed = revealedLetters[clue.id] || [];
  // const showFeedback = feedbackClue === clue.id;

  // const answer = isSolved ? clue.answer : '';

  return (
    <Box className="answer-box">
      {clue.answer.split('').map((letter, index) => {
        const isRevealed = revealedLetters.includes(index);
        const displayLetter = isSolved || isRevealed ? letter : clue.answer[index] || '';

        return (
          <Box
            key={index}
            className={`letter-box ${isRevealed ? 'revealed' : ''} ${isSolved ? 'solved' : ''}`}
          >
            {displayLetter}
          </Box>
        );
      })}
      {feedback && (
        <Box className="feedback-icon">
          {feedback === 'correct' ? (
            <MdCheckCircle style={{color: 'green', fontSize: 32}} />
          ) : (
            <MdCancel style={{color: 'red', fontSize: 32}} />
          )}
        </Box>
      )}
    </Box>
  );
}


export function RandomizerGame({client, rewards, solvedClues}: RandomizerGameProps)
{
  const [answers, setAnswers] = useState<{ [key: ClueIdStr]: string }>({});
  const [feedbackClue, setFeedbackClue] = useState<ClueId | null>(null);
  const [feedbackType, setFeedbackType] = useState<Feedback>(null);

  const handleAnswerChange = (clueId: ClueId, value: string) => {
    setAnswers((last) => { return {
      ...last,
      [clue_id_to_string(clueId)]: value.toUpperCase().trim(),
    }});
  

  const handleSubmit = (clue: Clue) => {
    const userAnswer = (answers[clue_id_to_string(clue)]);
    const correctAnswer = clue.answer.toUpperCase();
    const isCorrect = userAnswer === correctAnswer;

    client.solveClue(clue);
    setFeedbackClue(clue);
    setFeedbackType(isCorrect ? 'correct' : 'incorrect');


    setTimeout(() => {
      setFeedbackClue(null)
      setFeedbackType(null);
    }, 2000);
  };

  const handleForceSolve = (clue: ClueData) => {
    const confirmed = window.confirm(`Are you sure you want to force solve this clue?`);

    if (confirmed) {
      client.solveClue(clue);
      setFeedbackClue(clue);
      setFeedbackType('correct');

      setTimeout(() => {
        setFeedbackClue(null)
        setFeedbackType(null);
      }, 2000);
    }
  };



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
