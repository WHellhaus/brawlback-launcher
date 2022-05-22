import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
//import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';


import { MeleeOptions } from '@/containers/Settings/MeleeOptions';

const SettingsPage = () => {
  const [tabVal, setTabVal] = useState(0);

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static" sx={{ borderRadius: "20px", backgroundColor: "background.paper" }}>
        <Tabs
          value={tabVal}
          onChange={(_, value: number) => setTabVal(value)}
          indicatorColor="primary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="settings tabs"
          sx={{ width: "95%", margin: "0 auto" }}
        >
          <Tab label="General"  icon={<SportsEsportsIcon />} /> 
          <Tab label="Item Two" />
          <Tab label="Item Three" />
        </Tabs>
      </AppBar>

      <Box sx={{ 
        width: {
          xs: "95%", 
          sm: "90%"
        },
        margin: "0 auto"
      }}>
        {tabVal === 0 && <MeleeOptions />}
      </Box>
    </Box>
  )
}

export default SettingsPage;