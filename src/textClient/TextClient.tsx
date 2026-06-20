import {
  useEffect,
  useState,
  useMemo,
} from "react";
import MessagePart from "./MessagePart";
import TextClientTextBox from "./TextClientTextBox";
import { Client } from "archipelago.js";
import TextClientManager from "./textClientManager";
import { useTextClientMessages } from "./textClientHook";

function TextClient({ client }: { client: Client }) {
  // Create manager instance for this client
  const textClientManager = useMemo(() => new TextClientManager(), []);
  const messages = useTextClientMessages(textClientManager);
  const [followMessages, setFollowMessages] = useState(true);

  // Set up message listeners from the client
  useEffect(() => {
    if (!client) return;

    // Listen to various message types from archipelago.js
    const messageListener = (_text: string, nodes: any[]) => {
      textClientManager.addMessage("chat", nodes, client);
    };
    client.messages.on("message", messageListener);

    return () => {
      client.messages.off("message", messageListener);
    };
  }, [client, textClientManager]);

  return (
    <div
      style={{
        boxSizing: "border-box",
        width: "100%",
        height: "400px",
        display: "grid",
        gap: "0",
        gridTemplateRows: "3em 1fr auto",
        overflow: "hidden",
        border: "1px solid #ccc",
        borderRadius: "4px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div style={{
        padding: "0.5em 1em",
        borderBottom: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
      }}>
        <strong>Text Client</strong>
        <label style={{ fontSize: "0.9em" }}>
          <input
            type="checkbox"
            onChange={(event) => setFollowMessages(event.target.checked)}
            checked={followMessages}
          />
          {" "}Follow Messages
        </label>
      </div>
      <div style={{ flex: 1, overflow: "auto", backgroundColor: "#fff", padding: "0.5em" }}>
        {messages.map((message) => (
          <div key={message.key} style={{ padding: "0.25em", marginBottom: "0.25em" }}>
            {message.parts.map((part, index) => (
              <MessagePart key={index} part={part} />
            ))}
          </div>
        ))}
      </div>

      <TextClientTextBox textClientManager={textClientManager} client={client} />
    </div>
  );
}

export default TextClient;
