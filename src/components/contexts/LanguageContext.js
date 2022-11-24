import React, { useState, useContext } from 'react'

const LanguageContext = React.createContext();
export const useLanguageContext = () => useContext(LanguageContext);

function getBrowserLocales(options = {}) {

	const defaultOptions = {
		languageCodeOnly: false,
	};

	const opt = {
		...defaultOptions,
		...options,
	};

	const browserLocales =
		navigator.languages === undefined
		? [navigator.language]
		: navigator.languages;

	if (!browserLocales) {
		return undefined;
	}

	return browserLocales.map(locale => {
		const trimmedLocale = locale.trim();
		return opt.languageCodeOnly
			? trimmedLocale.split(/-|_/)[0]
			: trimmedLocale;
	});
}

function getDefaultLocale(browserLocale) {
	const fallbackLanguage = 'en', supportedLanguages = ['en', 'fr', 'es'];

	if (supportedLanguages.indexOf(browserLocale) > -1) {
		return browserLocale;
	}

	return fallbackLanguage;
}

export default function LanguageContextProvider({ children }) {
	const browserLanguages = getBrowserLocales({languageCodeOnly: true});
	const locale = getDefaultLocale(browserLanguages[0]);

	const [language, changeLanguage] = useState(locale);
	return (
		<LanguageContext.Provider value={{ language, changeLanguage }}>
			{children}
		</LanguageContext.Provider>
	);
}
