/* eslint-disable max-classes-per-file */
/* eslint-disable */
import React, {Component, useState} from 'react';
import {RewardsState, SlotData, ClueId, ClueIdStr, clue_id_to_string, Clue, CrossLetter, clue_id_to_loc_id} from '../../shared/types';
import {Paper, TextField, Button, Typography, Box, Chip} from '@mui/material';
import {MdCheckCircle, MdCancel, MdSettings} from 'react-icons/md';
// import './RandomizerGame.css';
import { ClientHandler } from '../../archipelago_client_handler';

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


export function RandomizerGame({client, rewards, visitedLocations}: RandomizerGameProps)
{
  const [answers, setAnswers] = useState<{ [key: ClueIdStr]: string }>({});
  const [feedbackClue, setFeedbackClue] = useState<ClueId | null>(null);
  const [feedbackType, setFeedbackType] = useState<Feedback>(null);

  const handleAnswerChange = (clueId: ClueId, value: string) => {
    setAnswers((last) => { return {
      ...last,
      [clue_id_to_string(clueId)]: value.toUpperCase().trim(),
    }});
  }
  

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

  const handleForceSolve = (clue: Clue) => {
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

    // const solvedCount = Object.keys(solvedClues).filter((id) => solvedClues[id]).length;

    const slotdata = client.getSlotData();
    const nCrossLetters = Math.floor(slotdata.cross_letters_per_reward * rewards.nCrossLetterRewards);
    const nRevealedClues = slotdata.n_starting_clues + (slotdata.clues_per_reward * rewards.nClueRewards);

    const revealedLetterIndicies = new DefaultMap<string, number[]>(() => []);
    slotdata.cross_letters.slice(0, nCrossLetters).forEach(cl => {
      revealedLetterIndicies.getOrCreate(clue_id_to_string(cl.clue_id)).push(cl.index);
    });

    return (
        <Box className="clues-container" p={2}>
          {slotdata.clues.map((clue, index) => {
            const clueIdStr = clue_id_to_string(clue);
            const isSolved = visitedLocations.has(clue_id_to_loc_id(clue));
            const isUncensored = index < nRevealedClues;
            const clasified = '█';
            const halfLength = clue.clue.length >> 1;
            const censoredClue = isUncensored
              ? clue.clue
              : clue.clue.substring(0, halfLength) + clasified.repeat((clue.clue.length - halfLength) >> 1);
            

            const feedback = (feedbackClue?.direction === clue.direction && feedbackClue.number === clue.number) ? feedbackType : null;
            const lettersForClue = revealedLetterIndicies.getOrCreate(clueIdStr);
            return (
              <Paper key={clueIdStr} className="clue-card" elevation={2}>
                <Box p={2}>
                  <Typography variant="body1" className="clue-text">
                    {censoredClue}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {isUncensored && (
                      <>
                        {' '}
                        {clue.direction}
                        {' clue'}
                      </>
                    )}
                    {/* {attempts > 0 && ` • ${attempts} wrong attempt${attempts > 1 ? 's' : ''}`} */}
                  </Typography>

                  <AnswerBox clue={clue} isSolved={isSolved} feedback={feedback} revealedLetters={lettersForClue}/>

                  {!isSolved && (
                    <Box display="flex" style={{marginTop: '16px', gap: '8px'}}>
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        placeholder="Enter answer"
                        value={answers[clueIdStr] || ''}
                        onChange={(e) => handleAnswerChange(clue, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSubmit(clue);
                          }
                        }}
                        disabled={isSolved}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSubmit(clue)}
                        disabled={isSolved || !answers[clueIdStr]}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => handleForceSolve(clue)}
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
