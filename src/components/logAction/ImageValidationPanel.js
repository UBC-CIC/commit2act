import React, { useState } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CloudUpload, Delete } from '@mui/icons-material';

import useTranslation from '../customHooks/translations';

const Dropbox = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 20vh;
  border-radius: 5px;
  padding: 1em 2em 2em;
  width: 80%;
  opacity: ${(props) => (props.itemdraggedover ? '0.5' : '1')};
  background: #1a1c1e;
  svg {
    color: #fff;
  }
  #browse {
    padding: 0.3em 1.2em 0.5em;
    cursor: pointer;
    border-radius: 5px;
    background: #380FD1;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    :hover {
      opacity: 0.7;
    }
    margin-top: 1em;
  }
  #image-upload {
    display: none;
  }
  #image-preview {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
  }
  #delete {
    border-radius: 50px;
    border: none;
    width: 100px;
    opacity: 0.85;
    position: absolute;
    cursor: pointer;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.5em;
  }
`;

const StyledButton = styled(Button)`
  width: 80%;
  max-width: 300px;
  padding: 1em 1em 1.3em;
  font-size: 1.2rem;
`;

const ImageValidationPanel = ({
  selectedImage,
  setSelectedImage,
  setActiveStep,
  activeStep,
  skipBonusQuestion,
}) => {
  const [itemDrag, setItemDrag] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState();
  const [fileTypeError, setFileTypeError] = useState(false);

  const dragOverHandler = (e) => {
    e.preventDefault();
    setItemDrag(true);
  };

  const dragLeaveHandler = (e) => {
    setItemDrag(!itemDrag);
  };

  const dropHandler = (e) => {
    // if the file is uploaded from the input button
    if (e.target.files) {
      setSelectedImage(e.target.files[0]);
      let url = URL.createObjectURL(e.target.files[0]);
      setSelectedImagePreview(url);
      // if the file is uploaded from the drag and drop box
    } else if (e.dataTransfer.files) {
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
        let url = URL.createObjectURL(e.dataTransfer.files[0]);
        setSelectedImagePreview(url);
      } else {
        setFileTypeError(true);
      }
    }
  };

  const handleButtonClick = (e) => {
    //skip to CO2SavedScreen step if skipBonusQuestion is true
    if (skipBonusQuestion) {
      setActiveStep(activeStep + 2);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const translation = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center',
          padding: '0 0 3em',
          width: '65%',
          borderRadius: '5px',
        }}
      >
        <Typography component="div" variant="subtitle2" sx={{ my: '0.5em' }}>
          {translation.imageValidationText}
        </Typography>
        <Typography sx={{ fontSize: '15px' }}>
          {translation.imageValidationDimensions}
        </Typography>
        {fileTypeError && (
          <Alert severity="error" onClose={() => setFileTypeError(false)}>
            {translation.imageValidationError}
          </Alert>
        )}
        <Dropbox
          onDragOver={dragOverHandler}
          onDragLeave={dragLeaveHandler}
          onDrop={dropHandler}
          itemdraggedover={itemDrag ? 1 : 0}
        >
          {selectedImage ? (
            <>
              <Typography component="div" variant="subtitle2" sx={{ my: '0.5em' }}>
                {translation.imageValidationSelected}
              </Typography>
              <Box id="image-preview" sx={{ width: '100%' }}>
                <Box
                  component="img"
                  sx={{
                    height: { xs: 110, md: 170 },
                    width: { xs: 110, md: 170 },
                    mt: '1em',
                  }}
                  alt="Uploaded Action Icon"
                  src={selectedImagePreview}
                ></Box>
                <button id="delete" onClick={() => setSelectedImage(null)}>
                  <Delete />
                  {translation.delete}
                </button>
              </Box>
            </>
          ) : (
            <>
              <CloudUpload fontSize="large" />
              <Typography component="div" variant="h2" sx={{ my: '0.5em' }}>
                {translation.imageValidationDrop}{' '}
              </Typography>

              <label htmlFor="image-upload" id="browse">
                <Typography variant="subtitle2">{translation.browse}</Typography>
              </label>
              <input
                accept="image/*"
                id="image-upload"
                type="file"
                onChange={dropHandler}
              />
            </>
          )}
        </Dropbox>
      </Box>
      {selectedImage ? (
        <StyledButton onClick={handleButtonClick} variant="contained">
          {translation.uploadImage}
        </StyledButton>
      ) : (
        <StyledButton onClick={handleButtonClick} color="error" variant="outlined">
          {translation.skip}
        </StyledButton>
      )}
     
    </Box>
  );
};

export default ImageValidationPanel;
