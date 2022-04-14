import React from 'react';
import { styled } from '@mui/material';
import { Typography, Box, Avatar, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Card = styled(Grid)(({ theme }) => ({
  backgroundColor: '#DBE2EF',
  width: '100%',
  minHeight: '25vh',
  marginBottom: '1.25em',
  padding: '1.875em',
  alignContent: 'center',
  borderRadius: '8px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
}));

const GroupCard = ({ group }) => {
  const { group_name, group_description, group_image, is_public } = group;
  const navigate = useNavigate();

  return (
    <Card container>
      <Avatar
        variant="rounded"
        sx={{
          width: {
            xs: 100,
          },
          height: {
            xs: 100,
          },
          alignSelf: { xs: 'center' },
          mb: { xs: '1.25em' },
        }}
        src={group_image ? group_image : null}
      ></Avatar>
      <Box
        component="div"
        sx={{
          width: '60vw',
          height: '100%',
          ml: { sm: '0em', md: '2.5em' },
          overflow: 'auto',
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Box
          component="div"
          sx={{
            height: '5vh',
            borderBottom: '3px solid #3F72AF',
            mb: '0.625em',
          }}
        >
          <Typography
            variant="h3"
            onClick={() => {
              navigate(`/group-profile/${group_name}`);
            }}
            sx={{ ':hover': { opacity: '0.6', cursor: 'pointer' } }}
          >
            {group_name}
          </Typography>
        </Box>
        <Typography variant="body2">{group_description}</Typography>
      </Box>
    </Card>
  );
};

export default GroupCard;
