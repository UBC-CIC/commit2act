import React, { useEffect, useState } from 'react';
import { Box, Grid, ImageListItemBar, CircularProgress } from '@mui/material';
import ImageListItem, {
  imageListItemClasses,
} from '@mui/material/ImageListItem';
import { getAllActions } from '../graphql/queries';
import { API } from 'aws-amplify';
import { styled } from '@mui/material/styles';
import ActionCard from '../components/ActionCard';

const StyledImageListItemBar = styled(ImageListItemBar)`
  .MuiImageListItemBar-title {
    overflow: visible;
    white-space: normal;
    overflow-wrap: break-word;
    font-size: 0.9rem;
    text-align: center;
  }
`;

const StyledImageListItem = styled(ImageListItem)`
  .MuiImageListItem-img {
    border-radius: 7px;
    height: 100px;
  }
`;

const ViewAndEditActions = () => {
  const [actionOptions, setActionOptions] = useState();
  const [selectedAction, setSelectedAction] = useState();
  const [openActionDialog, setOpenActionDialog] = useState(false);
  const [editAction, setEditAction] = useState(false);

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
  }, []);

  const getActions = async () => {
    const res = await API.graphql({ query: getAllActions });
    const actions = res.data.getAllActions;
    setActionOptions(actions);
  };
  return (
    <Grid
      item
      sx={{
        height: '50vh',
        overflow: 'auto',
      }}
    >
      {!actionOptions && <CircularProgress />}
      <Box
        sx={{
          display: 'grid',
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
                width: '100px',
                height: '100px',
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
                  src={`${action.action_icon}?w=248&fit=crop&auto=format`}
                  alt={action.action_name}
                  loading="lazy"
                />
              ) : (
                <Box
                  sx={{
                    backgroundColor: '#B4EEB4	',
                    width: '100px',
                    height: '100px',
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
export default ViewAndEditActions;
