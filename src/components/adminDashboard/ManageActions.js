import React, { useEffect, useState } from 'react';
import { Box, Grid, ImageListItemBar, CircularProgress } from '@mui/material';
import ImageListItem, {
  imageListItemClasses,
} from '@mui/material/ImageListItem';
import { getAllActions } from '../../graphql/queries';
import { API } from 'aws-amplify';
import { styled } from '@mui/material/styles';
import ActionCard from './ActionCard';
import { useLanguageContext } from "../contexts/LanguageContext";
import { useContentTranslationsContext } from '../contexts/ContentTranslationsContext';

const StyledImageListItemBar = styled(ImageListItemBar)`
  .MuiImageListItemBar-title {
    overflow: visible;
    white-space: normal;
    overflow-wrap: break-word;
    font-size: 1.3rem;
    color: #fff;
    text-align: center;
  }
`;

const StyledImageListItem = styled(ImageListItem)`
  .MuiImageListItem-img {
    border-radius: 7px;
    height: 278px;
    margin-bottom: 8px;
    width: 100%;
  }
`;

const ManageActions = () => {
  const [actionOptions, setActionOptions] = useState();
  const [selectedAction, setSelectedAction] = useState();
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [editAction, setEditAction] = useState(false);

  const { language } = useLanguageContext();
  const { contentTranslations } = useContentTranslationsContext();

  useEffect(() => {
    setOpenActionDialog(true);
  }, [selectedAction]);

  const handleClose = () => {
    setOpenActionDialog(false);
    setSelectedAction(null);
    setEditAction(false);
  };

  useEffect(() => {
    getActions();
  }, [language]);

  const getActions = async () => {
    const res = await API.graphql({ query: getAllActions });
    const actions = res.data.getAllActions;
    switch (language) {
      case 'en':
        setActionOptions(actions);
        break;
      case 'fr':
        translateActionsToFrench(actions);
        break;
      default:
        break;
    }
  };
  const translateActionsToFrench = (actions) => {
    const frenchTranslations = contentTranslations.find((translation) => translation.langCode === 'fr');

    if (!frenchTranslations) {
      console.error('No french translations found');
      setActionOptions(actions);
      return;
    }

    let updatedActions = actions.map((action) => {
      let frenchAction = frenchTranslations.translationJSON?.actions?.find((frenchActionObj) => frenchActionObj.action_id === action.action_id);

      if (!frenchAction) {
        return { ...action };
      }

      return { ...action, ...frenchAction };
    });
    setActionOptions(updatedActions);
  }

  return (
    <Grid
      item
      sx={{
        minHeight: '50vh'
      }}
    >
      {!actionOptions && <CircularProgress />}
      <Box
        sx={{
          display: 'grid',
          gap: '20px',
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
              key={index}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  opacity: '0.7',
                },
                filter: action.is_hidden && 'grayscale(100%)',
              }}
              onClick={() => setSelectedAction(action)}
            >
              {action.action_icon ? (
                <img
                  src={
                    `${action.action_icon}?w=248&fit=crop&auto=format` +
                    '?' +
                    new Date()
                  }
                  alt={action.action_name}
                  loading="lazy"
                />
              ) : (
                <Box
                  sx={{
                    backgroundColor: '#B4EEB4	',
                    borderRadius: '7px',
                  }}
                ></Box>
              )}
              <StyledImageListItemBar
                title={action.action_name}
                position="below"
              />
            </StyledImageListItem>
          ))}
        {selectedAction && (
          <ActionCard
            action={selectedAction}
            open={openActionDialog}
            handleClose={handleClose}
            editAction={editAction}
            setEditAction={setEditAction}
            getActions={getActions}
          />
        )}
      </Box>
    </Grid>
  );
};
export default ManageActions;
