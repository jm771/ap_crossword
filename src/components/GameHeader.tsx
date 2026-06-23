import { Box, Button, Chip, Typography } from "@mui/material";
import { MdSettings } from "react-icons/md";

export function GameHeader({
  handleOpenConfig,
  solvedCount,
  totalClues,
}: {
  handleOpenConfig: () => void;
  solvedCount: number;
  totalClues: number;
}) {
  return (
    <Box className="randomizer-header" sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <Typography variant="h4">Archipelago Crossword</Typography>
        <Box
          className="config-button-desktop"
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        <Box sx={{ display: "flex", gap: "16px" }}>
          <Chip
            label={`Solved: ${solvedCount} / ${totalClues}`}
            color="primary"
          />
        </Box>
        <Box
          className="config-button-mobile"
          sx={{
            display: { xs: "block", md: "none" },
          }}
        >
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
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ marginTop: "8px" }}
      >
        Solving clues are locations. Reward items are cross letters and
        uncensoring later clues.
      </Typography>
    </Box>
  );
}
