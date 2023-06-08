import React, { useEffect, useState}  from 'react';

import {
  Box,
  Typography,
  Button
} from '@mui/material';
import useTranslation from '../components/customHooks/translations';
import GroupCard from '../components/GroupCard';
import { API } from 'aws-amplify';
import {
  getAllGroupsForUser,
} from '../graphql/queries';
import { useNavigate } from 'react-router-dom';

const MyGroups = ({user, userType}) => {
  const navigate = useNavigate();
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    if (user) {
      getGroups();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const translation = useTranslation();
  const getGroups = async () => {
    const res = await API.graphql({
      query: getAllGroupsForUser,
      variables: { user_id: user.user_id },
    });
    setUserGroups(res.data.getAllGroupsForUser);
  };
  const renderGroupCards = () => {
    if (userGroups.length > 0) {
      return userGroups.map((group, index) => (
        <GroupCard key={index} group={group} user={user} />
      ));
    } else {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: '2em' }}>
          <Typography variant="subtitle2">{translation.noMyGroups}</Typography>
        </Box>
      );
    }
  };
  return (
    <>
    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
      <Typography variant="h1">{translation.myGroups}</Typography>
      <Box
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          m: '4em 0 1.25em',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: '1em' },
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            navigate('/create-group');
          }}
        >
          {translation.createNewGroup}
        </Button>
      </Box>
      {renderGroupCards()}
    </Box>
   </>
  );
};

export default MyGroups;
