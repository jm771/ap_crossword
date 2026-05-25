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
} from '@material-ui/core';

interface RandomizerConfigProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: RandomizerConfigState) => void;
  initialConfig?: RandomizerConfigState;
}

export interface RandomizerConfigState {
  slotName: string;
  archipelagoUrl: string;
  nLocations: number;
  nKeyItems: number;
  nNonKeyItems: number;
  minStartingClues: number;
  startingCluesProportion: number;
  nKeyForAllRevealProportion: number;
}

export const DEFAULT_RANDOMIZER_CONFIG: RandomizerConfigState = {
  slotName: 'Jack',
  archipelagoUrl: 'localhost:38281',
  nLocations: 100,
  nKeyItems: 20,
  nNonKeyItems: 80,
  minStartingClues: 4,
  startingCluesProportion: 0.1,
  nKeyForAllRevealProportion: 0.9,
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
      nLocations,
      nKeyItems,
      nNonKeyItems,
      minStartingClues,
      startingCluesProportion,
      nKeyForAllRevealProportion,
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

          <Divider />

          <Box mt={3} mb={3}>
            <Typography variant="h6" gutterBottom>
              Location Settings
            </Typography>
            <TextField
              label="Total Locations"
              fullWidth
              margin="normal"
              type="number"
              value={nLocations}
              onChange={this.handleChange('nLocations')}
              helperText="Total number of locations to check"
            />
          </Box>

          <Divider />

          <Box mt={3} mb={3}>
            <Typography variant="h6" gutterBottom>
              Item Configuration
            </Typography>
            <TextField
              label="Key Items"
              fullWidth
              margin="normal"
              type="number"
              value={nKeyItems}
              onChange={this.handleChange('nKeyItems')}
              helperText="Number of key items for progression"
            />
            <TextField
              label="Non-Key Items"
              fullWidth
              margin="normal"
              type="number"
              value={nNonKeyItems}
              onChange={this.handleChange('nNonKeyItems')}
              helperText="Number of non-key items (letter reveals)"
            />
          </Box>

          <Divider />

          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Starting Clues
            </Typography>
            <TextField
              label="Minimum Starting Clues"
              fullWidth
              margin="normal"
              type="number"
              value={minStartingClues}
              onChange={this.handleChange('minStartingClues')}
              helperText="Minimum number of clues revealed at start"
            />
            <TextField
              label="Starting Clues Proportion"
              fullWidth
              margin="normal"
              type="number"
              inputProps={{step: 0.01, min: 0, max: 1}}
              value={startingCluesProportion}
              onChange={this.handleChange('startingCluesProportion')}
              helperText="Proportion of total clues to reveal at start (0.0-1.0)"
            />
            <TextField
              label="Key Items for Full Reveal Proportion"
              fullWidth
              margin="normal"
              type="number"
              inputProps={{step: 0.01, min: 0, max: 1}}
              value={nKeyForAllRevealProportion}
              onChange={this.handleChange('nKeyForAllRevealProportion')}
              helperText="Proportion of key items needed for full reveal (0.0-1.0)"
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
