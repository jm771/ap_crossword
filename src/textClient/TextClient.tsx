import {
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import MessagePart from "./MessagePart";
import TextClientTextBox from "./TextClientTextBox";
import { Client } from "archipelago.js";
import TextClientManager from "./textClientManager";
import { useTextClientMessages } from "./textClientHook";
import styles from "./TextClient.module.css";
import { Box, Paper, Typography, Checkbox, FormControlLabel } from "@mui/material";

function TextClient({ client }: { client: Client }) {
  // Create manager instance for this client
  const textClientManager = useMemo(() => new TextClientManager(), []);
  const messages = useTextClientMessages(textClientManager);
  const [followMessages, setFollowMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to bottom when new messages arrive and follow is enabled
  useEffect(() => {
    if (followMessages && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, followMessages]);

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h6" className={styles.headerTitle}>
          Text Client
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={followMessages}
              onChange={(event) => setFollowMessages(event.target.checked)}
              size="small"
            />
          }
          label={<Typography variant="caption">Follow</Typography>}
        />
      </Box>
      <Box className={styles.messagesContainer}>
        {messages.map((message) => (
          <Paper key={message.key} className={styles.message} elevation={0} variant="outlined">
            {message.parts.map((part, index) => (
              <MessagePart key={index} part={part} />
            ))}
          </Paper>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <TextClientTextBox textClientManager={textClientManager} client={client} />
    </Box>
  );
}

export default TextClient;
