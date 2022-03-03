import React, { useState } from 'react';
import { Autocomplete, TextField, Typography, Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterMoment';
import moment from 'moment';
import PlantBasedMealAction from './PlantBasedMealAction';
import TransportationAction from './TransportationAction';
import PlasticWasteAction from './PlasticWasteAction';
import useMediaQuery from '@mui/material/useMediaQuery';

const SelfReportMenu = () => {
  const mobileGap = useMediaQuery('(min-width:600px') ? '0px' : '50px';
  const [selectedDate, setSelectedDate] = useState(
    moment().format('MMM Do YY')
  );
  const [selectedAction, setSelectedAction] = useState();

  let actionOptions = [
    'Plant Based Meals',
    'Transportation',
    'Reducing Plastic Waste',
  ];

  let groupOptions = ['Individual', 'UBC CIC'];

  const renderActionPanel = () => {
    if (selectedAction === 'Plant Based Meals') {
      return <PlantBasedMealAction />;
    } else if (selectedAction === 'Transportation') {
      return <TransportationAction />;
    } else if (selectedAction === 'Reducing Plastic Waste') {
      return <PlasticWasteAction />;
    }
  };

  return (
    <Grid container justifyContent="center">
      <Typography variant="h4" sx={{ py: 5 }}>
        Self Report Actions
      </Typography>
      <Grid
        container
        justifyContent="center"
        columnSpacing={selectedAction ? 6 : 0}
        gap={mobileGap}
      >
        <Grid item>
          <Grid container direction="column" gap="20px">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Choose Date"
                value={selectedDate}
                onChange={(newDate) => {
                  setSelectedDate(newDate);
                }}
                renderInput={(selectedDate) => <TextField {...selectedDate} />}
              />
            </LocalizationProvider>
            <Autocomplete
              disablePortal
              options={actionOptions}
              sx={{ width: 300 }}
              onChange={(event, newAction) => {
                setSelectedAction(newAction);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Choose Action" />
              )}
            />
            <Autocomplete
              disablePortal
              options={groupOptions}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Choose Self/Group" />
              )}
            />
          </Grid>
        </Grid>
        <Grid item>{renderActionPanel()}</Grid>
      </Grid>
    </Grid>
  );
};

export default SelfReportMenu;
