import { Box, Button, Chip, Typography } from "@mui/material";
import React from "react";
import { MdSettings } from "react-icons/md";

export function GameHeader({handleOpenConfig, solvedCount, totalClues}: {handleOpenConfig: () => void, solvedCount: number, totalClues: number}) {
    return (        <Box className="randomizer-header" p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Crossword Randomizer</Typography>
            <Box display="flex" style={{gap: '8px'}}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<MdSettings />}
                onClick={handleOpenConfig}
              >
                Config
              </Button>
            </Box>
          </Box>
          <Box display="flex" style={{gap: '16px', marginTop: '16px'}}>
            <Chip label={`Solved: ${solvedCount} / ${totalClues}`} color="primary" />
            {/* <Chip label={`Wrong Attempts: ${totalWrongAttempts}`} color="secondary" /> */}
          </Box>
          <Typography variant="body2" color="textSecondary" style={{marginTop: '8px'}}>
            Solve clues to earn letter reveals in other clues. Clues are in random order.
          </Typography>
        </Box>)
}