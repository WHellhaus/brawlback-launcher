import { css } from "@emotion/react";
import Typography from "@mui/material/Typography";
import React from "react";
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

export interface SettingItemProps {
  name: React.ReactNode | string;
  description?: React.ReactNode | string;
}

export const SettingItem: React.FC<SettingItemProps> = (props) => {
  return (
    <Box sx={{margin: "20px 0"}}>
      <Box sx={{paddingBottom: "10px", display: "flex", alignItems: "center"}}>
        <Typography
          variant="subtitle1"
          css={css`
            text-transform: capitalize;
          `}
        >
          {props.name}
        </Typography>
        {props.description && <Tooltip title={props.description}><InfoIcon sx={{marginLeft: "5px", fontSize: "20px"}} /></Tooltip>}
      </Box>
      {props.children}
    </Box>
  );
};
