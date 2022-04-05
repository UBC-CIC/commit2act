import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  FormControl,
  FormGroup,
  FormLabel,
  Card,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';
import { HighlightOff } from '@mui/icons-material';

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: 'h1',
          },
          style: {
            fontSize: 40,
            color: '#112D4E',
            fontWeight: 300,
          },
        },
        {
          props: {
            variant: 'h2',
          },
          style: {
            fontSize: 30,
            color: '#112D4E',
            fontWeight: 400,
          },
        },
        {
          props: {
            variant: 'h3',
          },
          style: {
            fontSize: 20,
            color: 'black',
            fontWeight: 400,
            margin: '1.5em 0',
          },
        },
        {
          props: {
            variant: 'h4',
          },
          style: {
            fontSize: 25,
            color: 'black',
            fontWeight: 100,
          },
        },
        {
          props: {
            variant: 'h5',
          },
          style: {
            fontSize: 50,
            color: 'black',
            fontWeight: 400,
          },
        },
      ],
    },
  },
});

const CreateAction = () => {
  const emptyActionItemForm = {
    item_name: '',
    item_description: '',
    co2_saved_per_unit: '',
  };
  const [createActionForm, setCreateActionForm] = useState({
    action_name: '',
    page_media: '',
    action_item: '',
    fallback_quiz_media: '',
  });
  const [actionItemsForm, setActionItemsForm] = useState(emptyActionItemForm);
  const [actionItems, setActionItems] = useState([]);
  const [actionItemCounter, setActionItemCounter] = useState(1);

  const updateItemForm = (e) => {
    setActionItemsForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddActionItem = (e) => {
    //adds the item from the form into actionItems array
    setActionItems((actionItems) => [...actionItems, actionItemsForm]);
    //clears the actionItemsForm so user can enter in a new action item
    setActionItemsForm(emptyActionItemForm);
  };

  const handleRemoveActionItem = (name) => {
    setActionItems(actionItems.filter((item) => item.item_name !== name));
  };

  const renderAddedActionItems = () => {
    return actionItems.map((item, index) => (
      <Card
        key={index}
        sx={{
          width: '100%',
          backgroundColor: 'white',
          mt: '1em',
          borderRadius: '5px',
        }}
      >
        <Typography>Item Name: {item.item_name}</Typography>
        <Typography>Item Description: {item.item_description}</Typography>
        <Typography>CO2 Per Unit Saved: {item.co2_saved_per_unit}</Typography>
        <Button sx={{}} onClick={() => handleRemoveActionItem(item.item_name)}>
          <HighlightOff />
        </Button>
      </Card>
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h1" sx={{ my: { xs: '1.5em' } }}>
          Create New Action Type
        </Typography>
      </Box>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 0, md: 1 }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          width: '100%',
          minHeight: '50vh',
          backgroundColor: '#DBE2EF',
          borderRadius: '8px',
          padding: '1.5em',
        }}
      >
        <FormControl>
          <Typography variant="h3">Action Name</Typography>
          <TextField
            required
            id="outlined-required"
            label="Action Name"
            InputLabelProps={{ shrink: true }}
          />
          <Typography variant="h3">Action Items</Typography>
          <FormGroup
            sx={{ gap: '1.5em', flexDirection: { xs: 'column', md: 'row' } }}
          >
            <TextField
              required
              id="outlined-required"
              label="Item Name"
              name="item_name"
              InputLabelProps={{ shrink: true }}
              value={actionItemsForm.item_name}
              onChange={updateItemForm}
            />
            <TextField
              label="Item Description"
              name="item_description"
              InputLabelProps={{ shrink: true }}
              value={actionItemsForm.item_description}
              onChange={updateItemForm}
            />
            <TextField
              required
              id="outlined-required"
              label="CO2 Per Unit Saved"
              name="co2_saved_per_unit"
              InputLabelProps={{ shrink: true }}
              value={actionItemsForm.co2_saved_per_unit}
              onChange={updateItemForm}
            />
            <Button variant="outlined" onClick={handleAddActionItem}>
              Add Action Item
            </Button>
          </FormGroup>
          {renderAddedActionItems()}
          <Typography variant="h3">Fallback Text</Typography>
          <TextField
            required
            id="outlined-required"
            label="Text"
            InputLabelProps={{ shrink: true }}
          />
          <Button sx={{ mt: '2em' }} variant="contained">
            Submit New Action
          </Button>
        </FormControl>
      </Grid>
    </ThemeProvider>
  );
};

export default CreateAction;
