import React, { useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import {
  Typography,
  Box,
  Avatar,
  Card,
  CardContent,
  Stack,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Public, Lock, ExpandMore } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const GroupCard = ({ group }) => {
  const {
    group_name,
    group_description,
    group_image,
    is_public,
    total_co2,
    weekly_co2,
    total_points,
    weekly_points,
  } = group;
  const [readMore, setReadMore] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));
  const descriptionLength = mobile ? 100 : 250;

  return (
    <Card
      sx={{
        display: 'flex',
        mb: '1em',
        textAlign: { xs: 'center', sm: 'left' },
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          alignItems: { xs: 'center', sm: 'flex-start' },
        }}
      >
        <Avatar
          variant="square"
          sx={{
            width: {
              xs: 100,
              sm: 150,
            },
            height: {
              xs: 100,
              sm: '100%',
            },
            alignSelf: { xs: 'center' },
            mt: { xs: '1em', sm: 0 },
          }}
          src={group_image ? group_image : null}
        >
          {group_name.charAt(0)}
        </Avatar>
        <CardContent
          sx={{
            width: { xs: '80%', sm: '100%' },
            p: '1.5em',
          }}
        >
          <Box
            component="div"
            sx={{
              borderBottom: '1px solid #3F72AF',
              mb: '0.625em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'flex-start' },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              sx={{ mb: '0.5em' }}
            >
              {is_public ? (
                <Public fontSize="small" />
              ) : (
                <Lock fontSize="small" />
              )}
              <Typography
                onClick={() => {
                  navigate(`/group-profile/${group_name}`);
                }}
                sx={{
                  ':hover': { opacity: '0.6', cursor: 'pointer' },
                  fontSize: 22,
                  fontWeight: '400',
                  color: '#455A7F',
                }}
              >
                {group_name}
              </Typography>
            </Stack>
          </Box>
          {/* render accordion view of group stats if screen width is less than 600px, otherwise render divider view */}
          {mobile ? (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="group-stats-content"
              >
                <Typography>View Group Stats</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List dense>
                  <ListItem>
                    <ListItemText primary="Total CO2" />
                    <span>
                      <Typography variant="body1">{total_co2} g</Typography>
                    </span>
                  </ListItem>
                  <Divider flexItem />
                  <ListItem>
                    <ListItemText primary="Weekly CO2" />
                    <span>
                      <Typography variant="body1">{weekly_co2} g</Typography>
                    </span>
                  </ListItem>
                  <Divider flexItem />
                  <ListItem>
                    <ListItemText primary="Total Points" />
                    <span>
                      <Typography variant="body1">{total_points} </Typography>
                    </span>
                  </ListItem>
                  <Divider flexItem />
                  <ListItem>
                    <ListItemText primary="Weekly Points" />
                    <span>
                      <Typography variant="body1">{weekly_points} </Typography>
                    </span>
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                '& .MuiTypography-body1': {
                  m: 1,
                },
              }}
            >
              <Typography variant="body1">Total CO2: {total_co2} g</Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body1">
                Weekly CO2: {weekly_co2} g{' '}
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body1">
                Total Points: {total_points}
              </Typography>
              <Divider orientation="vertical" flexItem />
              <Typography variant="body1">
                Weekly Points: {weekly_points}
              </Typography>
            </Box>
          )}

          <Typography variant="body2" sx={{ mt: '1em' }}>
            {readMore
              ? group_description
              : group_description.slice(0, descriptionLength)}
          </Typography>
          <Button
            sx={{ p: 0, mt: '0.5em', fontSize: 13 }}
            onClick={() => setReadMore(!readMore)}
          >
            Read {readMore ? 'Less' : 'More'}
          </Button>
        </CardContent>
      </Box>
    </Card>
  );
};

export default GroupCard;
