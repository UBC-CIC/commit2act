import React, { useState } from 'react';
import { TextField, Box, Typography, Grid, Button, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CloudUpload } from '@mui/icons-material';

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
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
            fontWeight: 500,
          },
        },
        {
          props: {
            variant: 'subtitle1',
          },
          style: {
            fontSize: 15,
            color: 'black',
            fontWeight: 100,
          },
        },
      ],
    },
  },
});

const Dropbox = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 20vh;
  background-color: #dbe2ef;
  border: 5px dotted #e2f5fe;
  border-radius: 5px;
  padding: 2em;
  width: 80%;
  opacity: ${(props) => (props.itemDraggedOver ? '0.5' : '1')};
  #browse {
    background: white;
    padding: 0.3em;
    cursor: pointer;
    border-radius: 5px;
    :hover: {
      opacity: 0.7;
    }
  }
  #image-upload {
    display: none;
  }
`;

const ImageValidationPanel = () => {
  const [selectedImage, setSelectedImage] = useState();
  const [itemDrag, setItemDrag] = useState(false);

  const dragOverHandler = (e) => {
    e.preventDefault();
    setItemDrag(true);
  };

  const dragLeaveHandler = (e) => {
    setItemDrag(!itemDrag);
  };

  const dropHandler = (e) => {
    e.preventDefault();
    setItemDrag(!itemDrag);
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) {
      setSelectedImage(null);
      return;
    }
    let fileType = e.dataTransfer.files[0].type;
    let validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (validTypes.includes(fileType)) {
      setSelectedImage(e.dataTransfer.files[0]);
    } else {
      return <Alert severity="error">This Is Not An Image File</Alert>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: '3em',
            width: '65%',
          }}
        >
          <Typography component="div" variant="subtitle1" sx={{ my: '0.5em' }}>
            Please upload an image related to your action item for verification
          </Typography>
          <Dropbox
            onDragOver={dragOverHandler}
            onDragLeave={dragLeaveHandler}
            onDrop={dropHandler}
            itemDraggedOver={itemDrag}
          >
            <CloudUpload fontSize="large" />
            <Typography component="div" variant="h3" sx={{ my: '0.5em' }}>
              Drop Your Image Here, Or{' '}
            </Typography>

            <label htmlFor="image-upload" id="browse">
              Browse
            </label>
            <input
              accept="image/*"
              id="image-upload"
              type="file"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </Dropbox>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ImageValidationPanel;
