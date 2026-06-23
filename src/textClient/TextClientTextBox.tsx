import { useState } from "react";
import { useTextClientHistory } from "./textClientHook";
import TextClientManager from "./textClientManager";
import { Client } from "archipelago.js";
import styles from "./TextClientTextBox.module.css";
import { Box, TextField, Button, CircularProgress } from "@mui/material";

const TextClientTextBox = ({
  textClientManager,
  client
}: {
  textClientManager: TextClientManager;
  client: Client;
}) => {
    const inputHistory = useTextClientHistory(textClientManager);
    const [inputText, setInputText] = useState("");
    const [cachedInputText, setCachedInputText] = useState("");
    const [sendingMessage, setSendingMessage] = useState(false);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const processInput = () => {
        if (inputText && !sendingMessage) {
            setSendingMessage(true);
            textClientManager
                .processInput(inputText, client)
                .finally(() => setSendingMessage(false));
            setInputText("");
            setCachedInputText("");
            setHistoryIndex(-1);
        }
    };

    const navigateHistory = (direction: number) => {
        if (historyIndex === 0 && direction < 0) {
            // back to entry
            setInputText(cachedInputText);
        } else if (historyIndex === -1 && direction > 0) {
            // going from saved index to history
            setCachedInputText(inputText);
            if (inputHistory.length > 0) {
                setInputText(inputHistory[0]);
                setHistoryIndex(0);
            }
        } else if (historyIndex >= 0 && direction > 0) {
            if (inputHistory.length > historyIndex + 1) {
                setInputText(inputHistory[historyIndex + 1]);
                setHistoryIndex(historyIndex + 1);
            }
        } else if (historyIndex >= 0 && direction < 0) {
            if (0 < historyIndex) {
                setInputText(inputHistory[historyIndex - 1]);
                setHistoryIndex(historyIndex - 1);
            }
        }
    };
    return (
        <Box className={styles.container}>
            <TextField
                value={inputText}
                type="text"
                placeholder="Type a message..."
                variant="outlined"
                size="small"
                fullWidth
                onChange={(e) => {
                    setInputText(e.target.value);
                    setHistoryIndex(-1);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        processInput();
                    } else if (e.key === "ArrowUp") {
                        navigateHistory(1);
                    } else if (e.key === "ArrowDown") {
                        navigateHistory(-1);
                    }
                }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={processInput}
                disabled={sendingMessage}
            >
                {sendingMessage ? <CircularProgress size={20} /> : "Send"}
            </Button>
        </Box>
    );
};
export default TextClientTextBox;
