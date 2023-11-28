import { IconButton, Tooltip, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import FilterListIcon from '@mui/icons-material/FilterList';
import useTranslation from './customHooks/translations';

export const SortLeaderboard = ({ selectedSort, onSelectSort }) => {
  const { sortingBy, changeSortingOrder } = useTranslation();
  const { name } = selectedSort;

  const describedById = 'sort-leaderboard-button-description';

  return (
    <>
      <Typography component="div" variant="subtitle2" id={describedById}>
        <span style={visuallyHidden}>{sortingBy} </span>
        {name}
      </Typography>
      <Tooltip title={changeSortingOrder}>
        <IconButton onClick={onSelectSort} aria-describedby={describedById}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};
