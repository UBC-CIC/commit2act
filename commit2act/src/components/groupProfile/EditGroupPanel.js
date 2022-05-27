import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormGroup,
  Button,
  Avatar,
  Alert,
  InputAdornment,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Input = styled('input')`
  display: none;
`;

const EditGroupPanel = ({ groupInfo }) => {
  const {
    group_description,
    group_image,
    group_name,
    is_public,
    private_password,
  } = groupInfo;
  const initialGroupForm = {
    name: group_name,
    description: group_description,
    image: group_image,
    is_public: is_public,
    private_password: private_password,
  };
  const [groupInfoForm, setGroupInfoForm] = useState(initialGroupForm);
  const [avatarPreview, setAvatarPreview] = useState();
  const [avatarFile, setAvatarFile] = useState();
  const [requiredAttributeError, setRequiredAttributeError] = useState(false);
  const [nameExistsError, setNameExistsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateForm = (e) => {
    setGroupInfoForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setAvatarPreview(null);
      return;
    }
    const imageFile = e.target.files[0];
    const previewLink = URL.createObjectURL(imageFile);
    setAvatarFile(imageFile);
    setAvatarPreview(previewLink);
  };

  const updateGroupInfo = async () => {};

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <Typography variant="h2">Edit Group Info</Typography>
      <Box
        sx={{
          p: '3em',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          overflow: 'initial',
        }}
      >
        <FormGroup
          sx={{
            mt: '2em',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1em',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1em',
            }}
          >
            {group_image && !avatarPreview ? (
              <>
                <Avatar
                  variant="rounded"
                  sx={{ height: 100, width: 100, alignSelf: 'center' }}
                  alt={`${group_name} avatar`}
                  src={group_image + '?' + new Date()}
                />
                <label htmlFor="action-icon-image">
                  <Input
                    accept="image/*"
                    id="action-icon-image"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <Button variant="outlined" component="span">
                    Upload Group Icon
                  </Button>
                </label>
              </>
            ) : (
              <>
                {avatarPreview ? (
                  <Avatar
                    variant="rounded"
                    sx={{
                      height: 100,
                      width: 100,
                    }}
                    alt="Uploaded Group Icon"
                    src={avatarPreview}
                  />
                ) : (
                  <Avatar
                    variant="rounded"
                    sx={{
                      height: 100,
                      width: 100,
                    }}
                  />
                )}

                <label htmlFor="action-icon-image">
                  <Input
                    accept="image/*"
                    id="action-icon-image"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <Button variant="outlined" component="span">
                    Upload Group Icon
                  </Button>
                </label>
              </>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1em',
              mt: '1em',
            }}
          >
            {requiredAttributeError && (
              <Alert severity="error">
                Please fill out all required fields
              </Alert>
            )}
            <TextField
              required
              label="Name"
              name="name"
              value={groupInfoForm.name}
              InputLabelProps={{ shrink: true }}
              onChange={updateForm}
            />
            <TextField
              required
              label="Description"
              name="description"
              multiline
              value={groupInfoForm.description}
              InputLabelProps={{ shrink: true }}
              sx={{ xs: { mt: '1.5em' } }}
              onChange={updateForm}
            />
            <Typography variant="h7">Group Privacy</Typography>
            <RadioGroup
              aria-labelledby="group-privacy-label"
              name="group-privacy-options"
              required
              sx={{ flexDirection: 'row' }}
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Public"
                checked={groupInfoForm.is_public === true}
                onClick={() =>
                  setGroupInfoForm({
                    ...groupInfoForm,
                    is_public: true,
                  })
                }
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Private"
                checked={groupInfoForm.is_public === false}
                onClick={() =>
                  setGroupInfoForm({
                    ...groupInfoForm,
                    is_public: false,
                  })
                }
              />
            </RadioGroup>
            {/* only show private password text field if user selects private group */}
            {!groupInfoForm.is_public && (
              <TextField
                label="password"
                name="private_password"
                value={groupInfoForm.private_password}
                InputLabelProps={{ shrink: true }}
                onChange={updateForm}
                sx={{ mt: '1.5em' }}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              ></TextField>
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: { xs: 'center', sm: 'space-between' },
                my: '2em',
              }}
            >
              <Button variant="outlined">Delete Group</Button>
              <Button
                variant="contained"
                sx={{
                  mt: { xs: '1.5em', sm: '0em' },
                }}
                onClick={updateGroupInfo}
              >
                Save Group Info
              </Button>
            </Box>
          </Box>
        </FormGroup>
      </Box>
    </>
  );
};

export default EditGroupPanel;
