import React, { useEffect, useState } from 'react';
import { Box, Grid, ImageListItemBar, CircularProgress } from '@mui/material';
import ImageListItem, {
  imageListItemClasses,
} from '@mui/material/ImageListItem';
import { getAllUngraveyardedActions } from '../graphql/queries';
import { API } from 'aws-amplify';
import { styled } from '@mui/material/styles';

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

const AllActions = ({ setSelectedAction }) => {
  const [actionOptions, setActionOptions] = useState();

  useEffect(() => {
    getActions();
  }, []);

  const getActions = async () => {
    const res = await API.graphql({ query: getAllUngraveyardedActions });
    const actions = res.data.getAllUngraveyardedActions;
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
      </Box>
    </Grid>
  );
};

export default AllActions;
