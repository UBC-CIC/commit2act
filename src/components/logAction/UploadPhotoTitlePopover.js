import React from 'react';
import {
  Box,
  Typography,
  Popover,
  List,
  ListItem,
  IconButton,
} from '@mui/material';
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
  const id = open ? 'upload-popover' : undefined;

  const translation = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
      }}
    >
      <Typography
        component="div"
        variant="h5"
        sx={{
          display: 'inline-flex',
          gap: '1rem',
          my: '0.5em',
          color: 'white',
          fontSize: '30px',
          fontWeight: 'bold',
        }}
      >
        {translation.showUsTheProof}
        <IconButton onClick={handlePopover}>
          <HelpRounded />
        </IconButton>
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{
          my: '1.5rem',
          mx: 0,
          color: 'white',
        }}
      >
        {translation.imageValidationText}
      </Typography>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ padding: '1rem' }}>
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
