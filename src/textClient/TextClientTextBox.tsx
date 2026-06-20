import { useState } from "react";
import { useTextClientHistory } from "./textClientHook";
import TextClientManager from "./textClientManager";
import { Client } from "archipelago.js";

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
        <div style={{ display: "flex", padding: "0.5em", gap: "0.5em", borderTop: "1px solid #ccc", backgroundColor: "#fff" }}>
            <input
                value={inputText}
                type="text"
                placeholder="Type a message..."
                style={{
                    flexGrow: 1,
                    padding: "0.5em",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                }}
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
            <button
                onClick={processInput}
                disabled={sendingMessage}
                style={{
                    padding: "0.5em 1em",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: sendingMessage ? "#ccc" : "#007bff",
                    color: "#fff",
                    cursor: sendingMessage ? "not-allowed" : "pointer",
                }}
            >
                {sendingMessage ? "..." : "Send"}
            </button>
        </div>
    );
};
export default TextClientTextBox;
