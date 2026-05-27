import { useState } from "react";
import { Clue, clue_id_to_desc, clue_id_to_string } from "../shared/types";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import { ClientHandler } from "../archipelago_client_handler";

export type Feedback = 'correct' | 'incorrect' | null;

function AnswerBox({clue,  isSolved, feedback, revealedLetters, userAnswer}:{clue: Clue, isSolved: boolean, feedback: Feedback, revealedLetters: number[], userAnswer: string}) 
{
  return (
    <Box className="answer-box">
      {clue.answer.split('').map((letter, index) => {
        const isRevealed = revealedLetters.includes(index);
        const displayLetter = isSolved || isRevealed ? letter : userAnswer[index] || '';

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

export function ClueCard({client, clue,  isSolved, isUncensored, revealedLetters}:
    {client: ClientHandler, clue: Clue, isSolved: boolean, isUncensored: boolean, revealedLetters: number[]})
{
    const clueIdStr = clue_id_to_string(clue);
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [feedbackType, setFeedbackType] = useState<Feedback>(null);
    const clasified = '█';
    const halfLength = clue.clue.length >> 1;
    const censoredClue = isUncensored
        ? clue.clue
        : clue.clue.substring(0, halfLength) + clasified.repeat((clue.clue.length - halfLength) >> 1);


    const handleSubmit = (clue: Clue) => {
        const correctAnswer = clue.answer.toUpperCase();
        const isCorrect = userAnswer === correctAnswer;

        if (isCorrect) {
            client.solveClue(clue);
        }
        setFeedbackType(isCorrect ? 'correct' : 'incorrect');


        setTimeout(() => {
            setFeedbackType(null);
        }, 2000);
    };

    const handleForceSolve = (clue: Clue) => {
        const confirmed = window.confirm(`Are you sure you want to force solve this clue?`);

        if (confirmed) {
            client.solveClue(clue);
            setFeedbackType('correct');

            setTimeout(() => {
            setFeedbackType(null);
            }, 2000);
        }
    };

    return (
        <Paper className="clue-card" elevation={2}>
        <Box p={2}>
            <Typography variant="body1" className="clue-text">
            {censoredClue}
            </Typography>
            <Typography variant="caption" color="textSecondary">
            {isUncensored && (
                <>
                {clue_id_to_desc(clue)}
                </>
            )}
            {/* {attempts > 0 && ` • ${attempts} wrong attempt${attempts > 1 ? 's' : ''}`} */}
            </Typography>

            <AnswerBox clue={clue} isSolved={isSolved} feedback={feedbackType} revealedLetters={revealedLetters} userAnswer={userAnswer}/>

            {!isSolved && (
            <Box display="flex" style={{marginTop: '16px', gap: '8px'}}>
                <TextField
                variant="outlined"
                size="small"
                fullWidth
                placeholder="Enter answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
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
                disabled={isSolved || !userAnswer}
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
};
