import React, { useState } from 'react';
import { Typography, Tooltip, Box, IconButton, Alert } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

import useTranslation from '../customHooks/translations';

const AddMemberPanel = ({ groupInfo }) => {
  const translation = useTranslation();
  const [copySuccess, setCopySuccess] = useState({
    link: false,
    password: false,
  });

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
    if (text === groupLink) {
      setCopySuccess((prev) => ({ ...prev, link: true }));
    } else {
      setCopySuccess((prev) => ({ ...prev, password: true }));
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems={{ xs: 'center', lg: 'flex-start' }}
    >
      <Typography component="div" variant="h3">
        {groupInfo.is_public ? translation.addMembersDescription : translation.addMembersDescriptionPassword}
      </Typography>
      <Typography component="div" variant="subtitle2" sx={{ m: '2em 0 1em 0' }}>
        {translation.groupLinkLabel}{' '}
      </Typography>
      <Box
        display="flex"
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          wordBreak: 'break-word',
        }}
      >
        <Typography
          component="div"
          variant="subtitle2"
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
          <Tooltip title="Copy Link">
            <IconButton
              aria-label="copy link"
              onClick={() => copyText(groupLink)}
            >
              <ContentCopy
                sx={{
                  alignSelf: 'center',
                  ':hover': { cursor: 'pointer', opacity: '0.5' },
                }}
              />
            </IconButton>
          </Tooltip>
        </Typography>
        {copySuccess.link && (
          <Alert
            severity="success"
            onClose={() => setCopySuccess((prev) => ({ ...prev, link: false }))}
            sx={{ ml: '1em', mt: { xs: '1em', md: '0' } }}
          >
            {translation.linkCopied}
          </Alert>
        )}
      </Box>
      {!groupInfo.is_public && (
        <>
          <Typography
            component="div"
            variant="subtitle2"
            sx={{ m: '2em 0 1em 0' }}
          >
            {translation.groupPasswordLabel}{' '}
          </Typography>
          <Box
            display="flex"
            sx={{
              flexDirection: { xs: 'column', md: 'row' },
              wordBreak: 'break-word',
            }}
          >
            <Typography
              component="div"
              variant="subtitle2"
              sx={{
                border: '1px black solid',
                borderRadius: '2px',
                pl: '1em',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {groupInfo.private_password}
              <Tooltip title="Copy Password">
                <IconButton
                  aria-label="copy password"
                  onClick={() => copyText(groupInfo.private_password)}
                >
                  <ContentCopy
                    sx={{
                      alignSelf: 'center',
                      ':hover': { cursor: 'pointer', opacity: '0.5' },
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Typography>
            {copySuccess.password && (
              <Alert
                severity="success"
                onClose={() =>
                  setCopySuccess((prev) => ({ ...prev, password: false }))
                }
                sx={{ ml: '1em', mt: { xs: '1em', md: '0' } }}
              >
                {translation.passwordCopied}
              </Alert>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default AddMemberPanel;
