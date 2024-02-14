import React from 'react';
import { useLanguageContext } from './contexts/LanguageContext';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTranslation from './customHooks/translations';

export default function LanguageHandler() {
  const { language, changeLanguage } = useLanguageContext();
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const translation = useTranslation();

  return (
    <>
     <label htmlFor="language">
      {translation.changeLanguage}
    </label>
    <Select
      id="language"
      value={language}
      onChange={(e) => changeLanguage(e.target.value)}
      sx={{
        height: '40px',
        marginRight: '8px',
      }}
    >
      <MenuItem value="en">{mobileView ? 'En' : 'English'}</MenuItem>
      <MenuItem value="fr">{mobileView ? 'fr' : 'français'}</MenuItem>
      <MenuItem value="es">{mobileView ? 'Es' : 'Español'}</MenuItem>
    </Select>
    </>
  );
}
