import { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { getAllGroups, getUserStatsForGroup } from '../graphql/queries';
import { useUserInfoContext } from './use-user-info-context';

const getStatsArray = (userStats, group) => {
  if (!userStats) return null;

  const { totalCo2, weeklyCo2, totalPoints, weeklyPoints } = userStats;
  if (!totalCo2 && !weeklyCo2 && !totalPoints && !weeklyPoints) {
    return null;
  }

  return [
    {
      groupTotal: group.total_co2 - totalCo2,
      contribution: totalCo2,
      title: 'totalCO2',
    },
    {
      groupTotal: group.weekly_co2 - weeklyCo2,
      contribution: weeklyCo2,
      title: 'weeklyCO2',
    },
    {
      groupTotal: group.total_points - totalPoints,
      contribution: totalPoints,
      title: 'totalPoints',
    },
    {
      groupTotal: group.weekly_points - weeklyPoints,
      contribution: weeklyPoints,
      title: 'weeklyPoints',
    },
  ];
};

export const useUserStats = (group = null) => {
  const { user } = useUserInfoContext();
  const [userStats, setUserStats] = useState(null);
  const [groups, setGroups] = useState(null);

  const userId = user?.user_id | null;
  const groupId = group?.group_id | null;

  useEffect(() => {
    const getGroups = async () => {
      const res = await API.graphql({
        query: getAllGroups,
      });
      setGroups(res.data.getAllGroups);
    };

    if (!groups) {
      getGroups();
    }
  }, [groups]);

  useEffect(() => {
    const getUserStats = async () => {
      const res = await API.graphql({
        query: getUserStatsForGroup,
        variables: { user_id: userId, group_id: groupId },
      });
      setUserStats(res.data.getUserStatsForGroup);
    };

    if (groupId && userId && !userStats) {
      getUserStats();
    }
  }, [groupId, userId, userStats]);

  const userStatsResolved = {
    totalCo2: userStats?.total_co2 | user?.total_co2 | null,
    weeklyCo2: userStats?.weekly_co2 | user?.weekly_co2 | null,
    totalPoints: userStats?.total_points | user?.total_points | null,
    weeklyPoints: userStats?.weekly_points | user?.weekly_points | null,
  };

  return {
    userStats: userStatsResolved,
    statsArray: getStatsArray(userStatsResolved, group),
  };
};
