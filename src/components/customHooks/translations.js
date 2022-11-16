//import React, { useState, useContext } from "react";
import LocalizedStrings from "react-localization";
import localization from "../../localization";
import { useLanguageContext } from "../contexts/LanguageContext";

export default function useTranslation() {
	const { language } = useLanguageContext();
	let translation = new LocalizedStrings(localization);

	translation.setLanguage(language);
	return translation;
}