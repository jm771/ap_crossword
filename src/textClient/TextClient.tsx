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
import styles from "./TextClient.module.css";

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
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>Text Client</span>
        <label className={styles.headerLabel}>
          <input
            type="checkbox"
            onChange={(event) => setFollowMessages(event.target.checked)}
            checked={followMessages}
          />
          {" "}Follow Messages
        </label>
      </div>
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div key={message.key} className={styles.message}>
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
