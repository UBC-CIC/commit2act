import React, { useState } from 'react';
import { Autocomplete, Box, TextField, Typography, Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterMoment';
import moment from 'moment';
import PlantBasedMealAction from './PlantBasedMealAction';
import TransportationAction from './TransportationAction';
import PlasticWasteAction from './PlasticWasteAction';

const SelfReportMenu = () => {
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
    } else {
      return (
        <Box
          sx={{
            width: 400,
            minHeight: '32vw',
            backgroundColor: '#e8f4f8',
          }}
        ></Box>
      );
    }
  };

  return (
    <div>
      <Typography variant="h3" sx={{ mb: 5 }}>
        Self Report Actions
      </Typography>
      <Grid container justifyContent="center" spacing={6} columnSpacing={6}>
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
        <Grid item xs={6}>
          {renderActionPanel()}
        </Grid>
      </Grid>
    </div>
  );
};

export default SelfReportMenu;
