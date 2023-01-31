import React from "react";
import { useLanguageContext } from "./contexts/LanguageContext";
import {
	Select,
	MenuItem
} from '@mui/material';

export default function LanguageHandler() {
	const { language, changeLanguage } = useLanguageContext();

	return (

  <Select
    id="language"
    value={language}
    onChange={(e) => changeLanguage(e.target.value)}
    sx={{
    	height: '40px',
    	marginRight: '8px'

    }}
  >
    <MenuItem value="en">English</MenuItem>
    <MenuItem value="fr">français</MenuItem>
    <MenuItem value="es">Español</MenuItem>
  </Select>
	);
}