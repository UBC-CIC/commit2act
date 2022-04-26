import React, { useState } from 'react';
import { Typography, Tooltip, Box, IconButton, Alert } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

const AddMemberPanel = ({ groupInfo }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const groupLink =
    groupInfo &&
    window.location.href.concat(
      '/add/',
      uuidv4(),
      '-',
      groupInfo.group_id ** 2
    );
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems={{ xs: 'center', lg: 'flex-start' }}
    >
      <Typography component="div" variant="h3">
        Add Users To This Group By Sending Them Your Group Link
      </Typography>
      <Typography component="div" variant="subtitle1" sx={{ mt: '2em' }}>
        Your Group Link is:{' '}
      </Typography>
      <Box display="flex" sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
        <Typography
          component="div"
          variant="subtitle1"
          sx={{
            border: '1px black solid',
            borderRadius: '2px',
            pl: '1em',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {groupLink}
          <Tooltip title="Copy">
            <IconButton aria-label="copy" onClick={() => copyText(groupLink)}>
              <ContentCopy
                sx={{
                  alignSelf: 'center',
                  ':hover': { cursor: 'pointer', opacity: '0.5' },
                }}
              />
            </IconButton>
          </Tooltip>
        </Typography>
        {copySuccess && (
          <Alert
            severity="success"
            onClose={() => setCopySuccess(false)}
            sx={{ ml: '1em', mt: { xs: '1em', md: '0' } }}
          >
            Link Copied!
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default AddMemberPanel;
