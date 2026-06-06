import { useState, useRef, useEffect } from "react";
import { Clue, clue_id_to_desc, ClueId } from "../shared/types";
import { Box, Button, Paper, Typography } from "@mui/material";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import { ClientHandler } from "../archipelago_client_handler";

export type Feedback = "correct" | "incorrect" | null;

// export type LetterRevealSubscription = {
//   subscribe_to_letter_reveal: (clueId: ClueId, index: number, callback: ) => void
// }

function SolvedCell({ letter }: { letter: string }) {
  return <Box className="letter-box solved">letter</Box>;
}

function RevealedCell({ letter }: { letter: string }) {
  return <Box className="letter-box revealed" />;
}

function InputCell({
  maybeRevealedLetter,
}: {
  maybeRevealedLetter: string | null;
}) {
  return (
    <Box className={`letter-box`}>
      <input
        ref={(el) => (inputRefs.current[index] = el)}
        type="text"
        maxLength={1}
        value={displayLetter}
        onKeyDown={(e) => handleKeyDown(index, e)}
        onClick={() => setFocus(index)}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "transparent",
          textAlign: "center",
          fontSize: "inherit",
          fontFamily: "inherit",
          outline: "none",
          cursor: "text",
          textTransform: "uppercase",
        }}
      />
    </Box>
  );
}

function AnswerBox({
  clue,
  isSolved,
  revealedLetters,
  setUserAnswer,
}: {
  clue: Clue;
  isSolved: boolean;
  revealedLetters: number[];
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const focusedIndex = useRef<number>(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(
    new Array(clue.answer.length),
  );

  function getFullAnswer(): string {
    return userAnswers
      .map((letter, index) =>
        revealedLetters.includes(index) ? clue.answer[index] : letter,
      )
      .join("");
  }

  function setUserAnswer(index: number, value: string) {
    setUserAnswers((old) => old.map((v, i) => (i == index ? value : v)));
  }

  function setFocus(index: number) {
    focusedIndex.current = index;
    inputRefs.current[focusedIndex.current]?.focus();
  }

  function moveFocusLeft(index: number): number {
    while (index >= 0) {
      index--;
      if (!revealedLetters.includes(index)) {
        break;
      }
    }
    setFocus(index);
    return index;
  }

  function moveFocusRight(index: number): number {
    while (index < clue.answer.length) {
      index++;
      if (!revealedLetters.includes(index)) {
        break;
      }
    }
    setFocus(index);
    return index;
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const currentChar = userAnswers[index];
      // Current cell is empty, move back to previous cell and delete that
      if (!currentChar) {
        index = moveFocusLeft(index);
      }
      setUserAnswer(index, "");
    } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      e.preventDefault();
      const letter = e.key.toUpperCase();
      setUserAnswer(index, letter);
      moveFocusRight(index);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveFocusLeft(index);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      moveFocusLeft(index);
    }
  };

  if (isSolved) {
    return (
      <Box className="answer-box">
        {clue.answer.split("").map((letter) => {
          return <SolvedCell letter={letter} />;
        })}
      </Box>
    );
  }

  return (
    <Box className="answer-box">
      {clue.answer.split("").map((letter, index) => {
        if (revealedLetters.includes(index))
          return <RevealedCell letter={letter} />;
        else {
          return <InputCell />;
        }
      })}
    </Box>
  );
}

export function ClueCard({
  client,
  clue,
  isSolved,
  isUncensored,
  revealedLetters,
}: {
  client: ClientHandler;
  clue: Clue;
  isSolved: boolean;
  isUncensored: boolean;
  revealedLetters: number[];
}) {
  const userAnswerRef = useRef<string>("");
  const [feedbackType, setFeedbackType] = useState<Feedback>(null);
  const clasified = "█";
  const halfLength = clue.clue.length >> 1;
  const censoredClue = isUncensored
    ? clue.clue
    : clue.clue.substring(0, halfLength) +
      clasified.repeat((clue.clue.length - halfLength) >> 1);

  function onAnswerChange(answer: string) {
    userAnswerRef.current = answer;
  }

  const handleSubmit = (clue: Clue) => {
    const correctAnswer = clue.answer.toUpperCase();
    const isCorrect = userAnswerRef.current === correctAnswer;

    if (isCorrect) {
      client.solveClue(clue);
    }
    setFeedbackType(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      setFeedbackType(null);
    }, 2000);
  };

  const handleForceSolve = (clue: Clue) => {
    const confirmed = window.confirm(
      `Are you sure you want to force solve this clue?`,
    );

    if (confirmed) {
      client.solveClue(clue);
      setFeedbackType("correct");

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
          {isUncensored && <>{clue_id_to_desc(clue)}</>}
          {/* {attempts > 0 && ` • ${attempts} wrong attempt${attempts > 1 ? 's' : ''}`} */}
        </Typography>

        <AnswerBox
          clue={clue}
          isSolved={isSolved}
          feedback={feedbackType}
          revealedLetters={revealedLetters}
          onAnswerChange={onAnswerChange}
        />
        {feedbackType && (
          <Box className="feedback-icon">
            {feedbackType === "correct" ? (
              <MdCheckCircle style={{ color: "green", fontSize: 32 }} />
            ) : (
              <MdCancel style={{ color: "red", fontSize: 32 }} />
            )}
          </Box>
        )}

        {!isSolved && (
          <Box display="flex" style={{ marginTop: "16px", gap: "8px" }}>
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
}
