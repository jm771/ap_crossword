import React, {Component} from 'react';
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

interface RandomizerConfigProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: RandomizerConfigState) => void;
  initialConfig?: RandomizerConfigState;
}

export interface RandomizerConfigState {
  slotName: string;
  archipelagoUrl: string;
}

export const DEFAULT_RANDOMIZER_CONFIG: RandomizerConfigState = {
  slotName: 'crossword',
  archipelagoUrl: 'localhost:38281',
};

export default class RandomizerConfig extends Component<RandomizerConfigProps, RandomizerConfigState> {
  constructor(props: RandomizerConfigProps) {
    super(props);
    this.state = props.initialConfig || DEFAULT_RANDOMIZER_CONFIG;
  }

  componentDidUpdate(prevProps: RandomizerConfigProps) {
    if (this.props.initialConfig && prevProps.initialConfig !== this.props.initialConfig) {
      this.setState(this.props.initialConfig);
    }
  }

  handleChange = (field: keyof RandomizerConfigState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState({
      [field]: field === 'slotName' || field === 'archipelagoUrl' ? value : parseFloat(value),
    } as any);
  };

  handleSave = () => {
    this.props.onSave(this.state);
    this.props.onClose();
  };

  render() {
    const {open, onClose} = this.props;
    const {
      slotName,
      archipelagoUrl,
    } = this.state;

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
              onChange={this.handleChange('slotName')}
              helperText="Your player name in the Archipelago session"
            />
            <TextField
              label="Archipelago URL"
              fullWidth
              margin="normal"
              value={archipelagoUrl}
              onChange={this.handleChange('archipelagoUrl')}
              helperText="Server address (e.g., localhost:38281)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={this.handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
