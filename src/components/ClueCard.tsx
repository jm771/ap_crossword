import React, { useState, useRef, ReactElement } from "react";
import { Clue, clue_id_to_desc } from "../shared/types";
import { Box, Button, Paper, Typography } from "@mui/material";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import { ClientHandler } from "../archipelago_client_handler";

export type Feedback = "correct" | "incorrect" | null;

function getCircularReplacer() {
  const ancestors = [];
  return function (key, value) {
    if (typeof value !== "object" || value === null) {
      return value;
    }
    // `this` is the object that value is contained in,
    // i.e., its direct parent.
    while (ancestors.length > 0 && ancestors.at(-1) !== this) {
      ancestors.pop();
    }
    if (ancestors.includes(value)) {
      return "[Circular]";
    }
    ancestors.push(value);
    return value;
  };
}

function AnswerBox({
  clue,
  isSolved,
  revealedLetters,
  userAnswers,
  setUserAnswer,
  children,
  handleSubmit,
}: {
  clue: Clue;
  isSolved: boolean;
  revealedLetters: number[];
  userAnswers: string[];
  setUserAnswer: (index: number, value: string) => void;
  children: ReactElement;
  handleSubmit: () => void;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const focusedIndex = useRef<number>(0);
  const [debugInfo, setDebugInfo] = useState<string>("");

  function setFocus(index: number) {
    focusedIndex.current = index;
    inputRefs.current[focusedIndex.current]?.focus();
  }

  function moveFocusLeft(index: number): number {
    let newIndex = index;
    while (newIndex >= 0) {
      newIndex--;
      if (!revealedLetters.includes(newIndex)) {
        break;
      }
    }
    if (newIndex >= 0) {
      setFocus(newIndex);
      return newIndex;
    } else {
      return index;
    }
  }

  function moveFocusRight(index: number): number {
    let newIndex = index;
    while (newIndex < clue.answer.length) {
      newIndex++;
      if (!revealedLetters.includes(newIndex)) {
        break;
      }
    }
    if (newIndex < clue.answer.length) {
      setFocus(newIndex);
      return newIndex;
    } else {
      return index;
    }
  }

  const handleOnInput = (e: React.FormEvent<HTMLInputElement>) => {
    setDebugInfo(
      (s) =>
        s +
        `\r\n[OnInput + ${typeof e} + ${e.eventPhase} + ${e.target} + ${e.currentTarget} + ${e.type}]`,
    );
  };

  const handleBeforeInput = (e: React.InputEvent<HTMLInputElement>) => {
    setDebugInfo(
      (s) =>
        s +
        `\r\n[BeforeInput + ${typeof e} + ${e.eventPhase} + ${e.target} + ${e.currentTarget} + ${e.type} ${e.data}]`,
    );
  };

  const handleCompUpdate = (e: React.CompositionEvent<HTMLInputElement>) => {
    setDebugInfo(
      (s) =>
        s +
        `\r\n[Comp update + ${typeof e} + ${e.eventPhase} ${e.target} + ${e.currentTarget} + ${e.data}]`,
    );
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebugInfo(
      (s) =>
        s +
        `\r\n[OnChange + ${typeof e} + ${e.target} + ${e.type} + ${e.currentTarget}]`,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setDebugInfo(
      (s) =>
        s +
        `\r\n[keyboardEvent + ${typeof e} + ${e.code} + ${e.key} + ${e.currentTarget} + ${e.detail}]`,
    );

    if (e.altKey || e.ctrlKey || e.metaKey) {
      return;
    }

    let index = focusedIndex.current;

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
      moveFocusRight(index);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (isSolved) {
    return (
      <Box className="answer-box">
        {clue.answer.split("").map((letter, index) => (
          <Box key={index} className="letter-box solved">
            {letter}
          </Box>
        ))}
      </Box>
    );
  }

  let firstEditable = true;
  return (
    <>
      <Box>{debugInfo}</Box>
      <Box className="answer-box">
        {userAnswers.map((letter, index) => {
          if (revealedLetters.includes(index))
            return (
              <Box key={index} className="letter-box revealed">
                {clue.answer[index]}
              </Box>
            );
          else {
            const tabIndex = firstEditable ? 0 : -1;
            firstEditable = false;
            return (
              <Box key={index} className={`letter-box`}>
                <input
                  tabIndex={tabIndex}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={letter}
                  onCompositionUpdate={(e) => handleCompUpdate(e)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  onBeforeInput={handleBeforeInput}
                  onInput={handleOnInput}
                  onChange={handleOnChange} // Handled by on key down
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
        })}
        {children}
      </Box>
    </>
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
  const [userAnswers, setUserAnswers] = useState<string[]>(
    // When I get internet there must be a better way
    clue.answer.split("").map((_) => ""),
  );
  const [feedbackType, setFeedbackType] = useState<Feedback>(null);
  const clasified = "█";
  const halfLength = clue.clue.length >> 1;
  const censoredClue = isUncensored
    ? clue.clue
    : clue.clue.substring(0, halfLength) +
      clasified.repeat((clue.clue.length - halfLength) >> 1);

  function getFullUserAnswer(): string {
    return userAnswers
      .map((letter, index) =>
        revealedLetters.includes(index) ? clue.answer[index] : letter,
      )
      .join("");
  }

  function setUserAnswer(index: number, value: string) {
    setUserAnswers((old) => old.map((v, i) => (i == index ? value : v)));
  }

  const handleSubmit = () => {
    const isCorrect = getFullUserAnswer() === clue.answer.toUpperCase();

    if (isCorrect) {
      client.solveClue(clue);
    }
    setFeedbackType(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      setFeedbackType(null);
    }, 2000);
  };

  const handleForceSolve = () => {
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
          revealedLetters={revealedLetters}
          userAnswers={userAnswers}
          setUserAnswer={setUserAnswer}
          handleSubmit={handleSubmit}
        >
          <>
            {" "}
            {feedbackType && (
              <Box className="feedback-icon">
                {feedbackType === "correct" ? (
                  <MdCheckCircle style={{ color: "green", fontSize: 32 }} />
                ) : (
                  <MdCancel style={{ color: "red", fontSize: 32 }} />
                )}
              </Box>
            )}
          </>
        </AnswerBox>

        {!isSolved && (
          <Box display="flex" style={{ marginTop: "16px", gap: "8px" }}>
            <Button
              tabIndex={-1}
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
              disabled={getFullUserAnswer().length !== clue.answer.length}
            >
              Submit
            </Button>
            <Button
              tabIndex={-1}
              variant="outlined"
              color="secondary"
              size="small"
              onClick={() => handleForceSolve()}
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
