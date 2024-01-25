import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Delete, CameraAlt } from '@mui/icons-material';

import useTranslation from '../customHooks/translations';
import UploadPhotoTitlePopover from './UploadPhotoTitlePopover';

const Dropbox = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 20vh;
  border-radius: 1.5rem;
  padding: 1em 2em 2em;
  width: 80%;
  opacity: ${(props) => (props.itemdraggedover ? '0.5' : '1')};
  background: #e661ae;
  svg {
    color: #fff;
  }
  #browse {
    padding: 0.5em 1.5em 0.5em;
    cursor: pointer;
    border-radius: 1.5rem;
    background: #380fd1;
    color: white;
    font-size: 20px;
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

const ImageValidationPanel = ({ selectedImage, setSelectedImage }) => {
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

  const translation = useTranslation();

  return (
    <>
      <UploadPhotoTitlePopover />
      <Box
        sx={{
          width: { sx: '100%', md: '50%' },
          margin: { md: '0 auto' },
        }}
      >
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
              <Typography
                component="div"
                variant="subtitle2"
                sx={{ my: '0.5em' }}
              >
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
              <CameraAlt sx={{ fontSize: '120px' }} />
              <label
                htmlFor="image-upload"
                id="browse"
                sx={{ borderRadius: '2rem' }}
              >
                <Typography variant="div">{translation.linkHere}</Typography>
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
    </>
  );
};

export default ImageValidationPanel;
