import { useState, useRef, useEffect } from "react";
import { Clue, clue_id_to_desc } from "../shared/types";
import { Box, Button, Paper, Typography } from "@mui/material";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import { ClientHandler } from "../archipelago_client_handler";

export type Feedback = 'correct' | 'incorrect' | null;

function AnswerBox({
  clue,
  isSolved,
  feedback,
  revealedLetters,
  userAnswer,
  onAnswerChange,
  focusedIndex,
  onFocusChange
}: {
  clue: Clue,
  isSolved: boolean,
  feedback: Feedback,
  revealedLetters: number[],
  userAnswer: string,
  onAnswerChange: (newAnswer: string) => void,
  focusedIndex: number,
  onFocusChange: (index: number) => void
})
{
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus the appropriate input when focusedIndex changes
    if (focusedIndex >= 0 && focusedIndex < inputRefs.current.length) {
      inputRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const isRevealed = revealedLetters.includes(index);

    if (isRevealed) {
      // Don't allow editing revealed letters
      e.preventDefault();
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();

      // Pad answer to be at least as long as we need
      const paddedAnswer = userAnswer.padEnd(clue.answer.length, ' ');
      const currentChar = paddedAnswer[index] || ' ';

      if (currentChar.trim() === '') {
        // Current cell is empty, delete previous cell and move back
        let prevIndex = index - 1;
        while (prevIndex >= 0 && revealedLetters.includes(prevIndex)) {
          prevIndex--;
        }
        if (prevIndex >= 0) {
          const newAnswer = paddedAnswer.substring(0, prevIndex) + ' ' + paddedAnswer.substring(prevIndex + 1);
          onAnswerChange(newAnswer);
          onFocusChange(prevIndex);
        }
      } else {
        // Current cell has a character, delete it and stay here
        const newAnswer = paddedAnswer.substring(0, index) + ' ' + paddedAnswer.substring(index + 1);
        onAnswerChange(newAnswer);
      }
    } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      e.preventDefault();
      const letter = e.key.toUpperCase();

      // Pad answer to be at least as long as we need
      const paddedAnswer = userAnswer.padEnd(clue.answer.length, ' ');

      // Update the answer at the correct index
      const newAnswer = paddedAnswer.substring(0, index) + letter + paddedAnswer.substring(index + 1);
      onAnswerChange(newAnswer);

      // Move to next non-revealed cell
      let nextIndex = index + 1;
      while (nextIndex < clue.answer.length && revealedLetters.includes(nextIndex)) {
        nextIndex++;
      }
      if (nextIndex < clue.answer.length) {
        onFocusChange(nextIndex);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      let prevIndex = index - 1;
      while (prevIndex >= 0 && revealedLetters.includes(prevIndex)) {
        prevIndex--;
      }
      if (prevIndex >= 0) {
        onFocusChange(prevIndex);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      let nextIndex = index + 1;
      while (nextIndex < clue.answer.length && revealedLetters.includes(nextIndex)) {
        nextIndex++;
      }
      if (nextIndex < clue.answer.length) {
        onFocusChange(nextIndex);
      }
    }
  };

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
            {!isSolved && !isRevealed ? (
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={displayLetter}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onClick={() => onFocusChange(index)}
                readOnly={isRevealed}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'center',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  outline: 'none',
                  cursor: 'text',
                  textTransform: 'uppercase'
                }}
              />
            ) : (
              displayLetter
            )}
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
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [feedbackType, setFeedbackType] = useState<Feedback>(null);
    const [focusedIndex, setFocusedIndex] = useState<number>(0);
    const clasified = '█';
    const halfLength = clue.clue.length >> 1;
    const censoredClue = isUncensored
        ? clue.clue
        : clue.clue.substring(0, halfLength) + clasified.repeat((clue.clue.length - halfLength) >> 1);

    // Initialize focus to first non-revealed cell when clue changes
    useEffect(() => {
        let firstEditableIndex = 0;
        while (firstEditableIndex < clue.answer.length && revealedLetters.includes(firstEditableIndex)) {
            firstEditableIndex++;
        }
        setFocusedIndex(firstEditableIndex);
    }, [clue, revealedLetters]);

    const handleAnswerChange = (newAnswer: string) => {
        setUserAnswer(newAnswer);
    };

    const handleSubmit = (clue: Clue) => {
        const correctAnswer = clue.answer.toUpperCase();
        const isCorrect = userAnswer.trim() === correctAnswer;

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

            <AnswerBox
                clue={clue}
                isSolved={isSolved}
                feedback={feedbackType}
                revealedLetters={revealedLetters}
                userAnswer={userAnswer}
                onAnswerChange={handleAnswerChange}
                focusedIndex={focusedIndex}
                onFocusChange={setFocusedIndex}
            />

            {!isSolved && (
            <Box display="flex" style={{marginTop: '16px', gap: '8px'}}>
                <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit(clue)}
                disabled={isSolved || !userAnswer.trim()}
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
