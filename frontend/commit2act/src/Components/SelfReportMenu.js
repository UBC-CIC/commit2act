import React, { useState } from 'react';
import { Box, Autocomplete, TextField } from '@mui/material';
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
    }
  };

  return (
    <div>
      <h1>Self Report Actions</h1>
      <Box style={{ display: 'flex' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingRight: '20px',
            gap: '20px',
          }}
        >
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
          {/* <Button variant="contained">Add Action</Button> */}
        </Box>
        <div>{renderActionPanel()}</div>
      </Box>
    </div>
  );
};

export default SelfReportMenu;
