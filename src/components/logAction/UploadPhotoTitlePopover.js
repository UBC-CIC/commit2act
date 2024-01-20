import React from 'react';
import { Box, Typography, Popover, List, ListItem } from '@mui/material';
import { HelpRounded, SmartToyOutlined, Lightbulb } from '@mui/icons-material';

import useTranslation from '../customHooks/translations';

const UploadPhotoTitlePopover = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const translation = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      <Typography
        component="div"
        variant="h5"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1rem',
          my: '0.5em',
          color: 'white',
          fontSize: '30px',
          fontWeight: 'bold',
        }}
      >
        {translation.showUsTheProof}
        <Typography
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopover}
          onMouseLeave={handleClosePopover}
        >
          <HelpRounded />
        </Typography>
      </Typography>
      <Typography variant="subtitle2" sx={{ my: '0.5em', color: 'white' }}>
        {translation.imageValidationText}
      </Typography>
      <Popover
        id="upload-photo-popover"
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{
          pointerEvents: 'none',
        }}
        disableRestoreFocus
      >
        <Box sx={{ padding: '2rem' }}>
          <SmartToyOutlined fontSize="large" />
          <Typography sx={{ fontSize: '20px', paddingTop: '1rem' }}>
            {translation.uploadPhoto}
          </Typography>
          <Typography sx={{ fontSize: '20px', paddingTop: '1rem' }}>
            <Lightbulb /> {translation.topTips}
          </Typography>
          <List sx={{ padding: '0 2rem', listStyleType: 'disc' }}>
            <ListItem sx={{ display: 'list-item' }}>
              {translation.imageValidationDimensions}
            </ListItem>
            <ListItem sx={{ display: 'list-item', textAlign: 'wrap' }}>
              {translation.uploadImageInfo}
            </ListItem>
          </List>
        </Box>
      </Popover>
    </Box>
  );
};

export default UploadPhotoTitlePopover;
