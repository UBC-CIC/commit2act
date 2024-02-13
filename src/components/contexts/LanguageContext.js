import React, { useEffect, useState, useContext } from 'react';

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
	const fallbackLanguage = 'en';
	const supportedLanguages = ['en', 'fr', 'es'];

	if (supportedLanguages.indexOf(browserLocale) > -1) {
		return browserLocale;
	}

	return fallbackLanguage;
}

export default function LanguageContextProvider({ children }) {
	const browserLanguages = getBrowserLocales({languageCodeOnly: true});
	const defaultLocale = getDefaultLocale(browserLanguages[0]);
	const [language, setLanguage] = useState(localStorage.getItem('selectedLanguage') ?? defaultLocale);

	const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  };

	useEffect(() => {
    const storedLanguage = localStorage.getItem('selectedLanguage');

    if (storedLanguage && storedLanguage !== language) {
      setLanguage(storedLanguage);
    }
  }, [setLanguage, language]);

	return (
		<LanguageContext.Provider value={{ language, changeLanguage }}>
			{children}
		</LanguageContext.Provider>
	);
}
