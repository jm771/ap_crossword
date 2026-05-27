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

export interface RandomizerConfigProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: RandomizerConfig) => void;
  connectionMessage: string;
}

export interface RandomizerConfig {
  slotName: string;
  archipelagoUrl: string;
}

export const DEFAULT_RANDOMIZER_CONFIG: RandomizerConfig = {
  slotName: 'crossword',
  archipelagoUrl: 'localhost:38281',
};

function getInitialConfigState() {
  return DEFAULT_RANDOMIZER_CONFIG;
}

export default function RandomizerConfigDialog({open, onClose, onSave, connectionMessage}: RandomizerConfigProps) //extends Component<RandomizerConfigProps, RandomizerConfigState> 
{
    const [archipelagoUrl, setArchipelagoUrl] = useState<string>(getInitialConfigState().archipelagoUrl);
    const [slotName, setSlotName] = useState<string>(getInitialConfigState().slotName);


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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Close
          </Button>
          <Button onClick={() => onSave({archipelagoUrl, slotName})} color="primary" variant="contained">
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    );
}
