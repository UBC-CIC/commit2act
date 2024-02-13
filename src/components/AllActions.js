import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  ImageListItemBar,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ImageListItem, {
  imageListItemClasses,
} from '@mui/material/ImageListItem';
import { getAllUngraveyardedActions } from '../graphql/queries';
import { API } from 'aws-amplify';
import { styled } from '@mui/material/styles';
import useTranslation from './customHooks/translations';
import { useContentTranslationsContext } from './contexts/ContentTranslationsContext';

const StyledImageListItemBar = styled(ImageListItemBar)`
  .MuiImageListItemBar-title {
    overflow: visible;
    white-space: normal;
    overflow-wrap: break-word;
    font-size: 1.2rem;
    color: #fff;
    text-align: center;
  }
`;

const StyledImageListItem = styled(ImageListItem)`
  .MuiImageListItem-img {
    border-radius: 7px;
    margin-bottom: 8px;
    height: 120px;
    width: 100%;
    @media only screen and (min-width: 800px) {
      height: 278px;
    },
  }
`;

const AllActions = ({ setSelectedAction, setActiveStep }) => {
  const [actionOptions, setActionOptions] = useState();
  const displayDefaultMsg = actionOptions && actionOptions.length === 0;

  const translation = useTranslation();
  const nav = useNavigate();
  const { contentTranslations } = useContentTranslationsContext();

  useEffect(() => {
    if (contentTranslations.length > 0) {
      getActions();
    }
  }, [contentTranslations]);

  const getActions = async () => {
    const res = await API.graphql({ query: getAllUngraveyardedActions });
    const actions = res.data.getAllUngraveyardedActions;
    if (translation.getLanguage() !== 'en') {
      const relevantTranslationObject = contentTranslations.find(
        (contentTranslation) =>
          contentTranslation.langCode.toLowerCase() ===
          translation.getLanguage().toLowerCase()
      );
      const updatedActions = disassembleInto(
        actions,
        relevantTranslationObject?.translationJSON?.actions || []
      );
      setActionOptions(updatedActions);
    } else {
      setActionOptions(actions);
    }
  };

  const disassembleInto = (actions, translatedActions) => {
    return actions.map((action) => {
      const translatedAction = translatedActions.find(
        (translatedAction) => translatedAction.action_id === action.action_id
      );
      return {
        ...action,
        ...translatedAction,
      };
    });
  };

  const handleSelectedAction = (action) => {
    setSelectedAction(action);
    setActiveStep(1);
    const actionUID = action.action_name
      .toLowerCase()
      .trim()
      .replaceAll(' ', '-');
    nav(`/log-action/${actionUID}`);
  };

  return (
    <Grid
      item
      sx={{
        minHeight: '50vh',
        display: displayDefaultMsg && 'flex',
        alignItems: displayDefaultMsg && 'center',
        justifyContent: displayDefaultMsg && 'center',
      }}
    >
      {!actionOptions && <CircularProgress />}
      {displayDefaultMsg && (
        <Typography variant="subtitle2">No Actions to Display</Typography>
      )}
      <Box
        sx={{
          display: 'grid',
          gap: '10px',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          rowGap: 2,
          [`& .${imageListItemClasses.root}`]: {
            display: 'flex',
            flexDirection: 'column',
          },
          justifyItems: 'center',
        }}
      >
        {actionOptions &&
          actionOptions.map((action, index) => (
            <StyledImageListItem
              component="button"
              key={index}
              sx={{
                width: '100%',
                height: '100px',
                cursor: 'pointer',
                background: 'none',
                padding: '0',
                boxShadow: '0',
                border: '0',
                '&:hover': {
                  opacity: '0.7',
                },
              }}
              onClick={() => handleSelectedAction(action)}
            >
              {action.action_icon ? (
                <img
                  src={`${action.action_icon}?w=248&fit=crop&auto=format`}
                  loading="lazy"
                  aria-hidden="true"
                  alt=""
                />
              ) : (
                <Box
                  sx={{
                    backgroundColor: '#B4EEB4	',
                    width: '100%',
                    height: '100px',
                    borderRadius: '7px',
                  }}
                ></Box>
              )}
              <StyledImageListItemBar
                sx={{ width: '100%' }}
                title={action.action_name}
                position="below"
              />
            </StyledImageListItem>
          ))}
      </Box>
    </Grid>
  );
};

export default AllActions;
