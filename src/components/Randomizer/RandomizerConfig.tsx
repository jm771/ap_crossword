import React, {Component, useState} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { MdLabel } from 'react-icons/md';

export interface RandomizerConfigProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: RandomizerConfig) => void;
  connectionMessage: string;
}

export interface RandomizerConfig {
  slotName: string;
  archipelagoUrl: string;
  configSet: boolean;
}

const DEFAULT_RANDOMIZER_CONFIG: RandomizerConfig = {
  slotName: 'crossword',
  archipelagoUrl: 'localhost:38281',
  configSet: false
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

const SLOT_COOKIE_NAME = 'crosswordSlotName';
const URL_COOKIE_NAME = 'crosswordArchipelagoUrl';
const IS_SET_COOKIE_NAME = 'crosswordConfigSet';

export function getInitialConfigState() : RandomizerConfig {

  return {
    slotName: getCookie(SLOT_COOKIE_NAME, DEFAULT_RANDOMIZER_CONFIG.slotName),
    archipelagoUrl: getCookie(URL_COOKIE_NAME, DEFAULT_RANDOMIZER_CONFIG.archipelagoUrl),
    configSet: getCookie(IS_SET_COOKIE_NAME, '') != '',
  }
}

export default function RandomizerConfigDialog({open, onClose, onSave, connectionMessage}: RandomizerConfigProps) //extends Component<RandomizerConfigProps, RandomizerConfigState> 
{
    const [archipelagoUrl, setArchipelagoUrl] = useState<string>(getInitialConfigState().archipelagoUrl);
    const [slotName, setSlotName] = useState<string>(getInitialConfigState().slotName);

    const onConnectClick = () => {
      setCookie(URL_COOKIE_NAME, archipelagoUrl);
      setCookie(SLOT_COOKIE_NAME, slotName);
      setCookie(IS_SET_COOKIE_NAME, 'true');
      onSave({archipelagoUrl, slotName, configSet: true})
    } 


    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Randomizer Configuration</DialogTitle>
        <DialogContent>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Archipelago Connection
            </Typography>
            <TextField
              label="Slot Name"
              fullWidth
              margin="normal"
              value={slotName}
              onChange={(e) => setSlotName(e.target.value)}
              helperText="Your player name in the Archipelago session"
            />
            <TextField
              label="Archipelago URL"
              fullWidth
              margin="normal"
              value={archipelagoUrl}
              onChange={(e) => setArchipelagoUrl(e.target.value)}
              helperText="Server address (e.g., localhost:38281)"
            />
          </Box>
          <Typography variant="body1">{connectionMessage}</Typography >
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
