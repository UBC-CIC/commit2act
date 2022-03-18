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
  const { name, description } = group;
  const navigate = useNavigate();

  return (
    <Card container>
      <Avatar
        variant="rounded"
        sx={{
          width: {
            xs: '19vw',
            sm: '22vw',
            md: '9vw',
            xl: '9vw',
          },
          height: {
            xs: '10vh',
            sm: '12vh',
            md: '18vh',
            xl: '18vh',
          },
          alignSelf: { xs: 'center' },
          mb: { xs: '1.25em' },
        }}
      >
        {name.charAt(0)}
      </Avatar>
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
              navigate(`/group-profile/${name}`);
            }}
            sx={{ ':hover': { opacity: '0.6', cursor: 'pointer' } }}
          >
            {name}
          </Typography>
        </Box>
        <Typography variant="body2">{description}</Typography>
      </Box>
    </Card>
  );
};

export default GroupCard;
