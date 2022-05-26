import React from 'react'
import { Box } from "@mui/system";
import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import TitleLogo from "@/styles/images/brawlback_textraw.png";
//import BrawlbackTitle from '../../assets/BrawlbackCover-transparent.png';


const UserHeader = () => {
  const username = 'Hellhaus';
  const connectCode = 'Hell#533';
  return (
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between'}}>
          <Box sx={{marginLeft: "15px", marginTop: "20px"}}>
            {/* <img src={BrawlbackTitle} width={315} height={77}/> */}
            <img src={TitleLogo} height={60} />
          </Box>

          <Box sx={{display: 'inline-flex', marginRight: '30px'}}>
            <Avatar sx={{ bgcolor: 'primary.main', marginTop: '15px', marginRight: '15px' }}>N</Avatar>
            <Box>
              <Typography variant='h6'>{username}</Typography>
              <Typography variant='caption' sx={{color: 'text.secondary'}}>{connectCode}</Typography>
            </Box>
          </Box>

      </Box>
  )
}

export default UserHeader