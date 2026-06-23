import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";

export interface RandomizerConfigProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: RandomizerConfig) => void;
  connectionMessage: string;
}

export interface RandomizerConfig {
  slotName: string;
  archipelagoUrl: string;
  password: string;
  configSet: boolean;
}

const DEFAULT_RANDOMIZER_CONFIG: RandomizerConfig = {
  slotName: "crossword",
  archipelagoUrl: "localhost:38281",
  password: "",
  configSet: false,
};

function getCookie(name: string, ifMissing: string): string {
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [k, v] = cookie.split("=");

    if (decodeURIComponent(k) === name) {
      return decodeURIComponent(v);
    }
  }

  return ifMissing;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}`;
}

const SLOT_COOKIE_NAME = "crosswordSlotName";
const URL_COOKIE_NAME = "crosswordArchipelagoUrl";
const PASSWORD_COOKIE_NAME = "crosswordArchipelagoPassword";
const IS_SET_COOKIE_NAME = "crosswordConfigSet";

export function getInitialConfigState(): RandomizerConfig {
  return {
    slotName: getCookie(SLOT_COOKIE_NAME, DEFAULT_RANDOMIZER_CONFIG.slotName),
    archipelagoUrl: getCookie(
      URL_COOKIE_NAME,
      DEFAULT_RANDOMIZER_CONFIG.archipelagoUrl,
    ),
    password: getCookie(
      PASSWORD_COOKIE_NAME,
      DEFAULT_RANDOMIZER_CONFIG.password,
    ),
    configSet: getCookie(IS_SET_COOKIE_NAME, "") != "",
  };
}

export default function RandomizerConfigDialog({
  open,
  onClose,
  onSave,
  connectionMessage,
}: RandomizerConfigProps) {
  const [archipelagoUrl, setArchipelagoUrl] = useState<string>(
    getInitialConfigState().archipelagoUrl,
  );
  const [slotName, setSlotName] = useState<string>(
    getInitialConfigState().slotName,
  );
  const [password, setPassword] = useState<string>(
    getInitialConfigState().password,
  );

  const onConnectClick = () => {
    setCookie(URL_COOKIE_NAME, archipelagoUrl);
    setCookie(SLOT_COOKIE_NAME, slotName);
    setCookie(PASSWORD_COOKIE_NAME, password);
    setCookie(IS_SET_COOKIE_NAME, "true");
    onSave({ archipelagoUrl, slotName, password, configSet: true });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Randomizer Configuration</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Archipelago Connection
          </Typography>
          <TextField
            slotProps={{
              htmlInput: {
                autoCapitalize: "none",
                autoCorrect: "off",
                spellCheck: false,
                inputMode: "url",
              },
            }}
            label="Archipelago URL"
            fullWidth
            margin="normal"
            value={archipelagoUrl}
            onChange={(e) => setArchipelagoUrl(e.target.value)}
            helperText="Server address (e.g., localhost:38281)"
          />
        </Box>
        <TextField
          label="Slot Name"
          slotProps={{
            htmlInput: {
              autoCapitalize: "none",
              autoCorrect: "off",
              spellCheck: false,
            },
          }}
          fullWidth
          margin="normal"
          value={slotName}
          onChange={(e) => setSlotName(e.target.value)}
          helperText="Your player name in the Archipelago session"
        />
        <TextField
          label="Archipelago Server Password"
          fullWidth
          margin="normal"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          helperText="Server password or blank"
        />
        <Typography variant="body1">{connectionMessage}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button onClick={onConnectClick} color="primary" variant="contained">
          Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
}
