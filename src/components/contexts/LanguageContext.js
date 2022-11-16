import React, { useState, useContext } from 'react'

const LanguageContext = React.createContext();
export const useLanguageContext = () => useContext(LanguageContext);

export default function LanguageContextProvider({ children }) {
	const [language, changeLanguage] = useState('en');
	return (
		<LanguageContext.Provider value={{ language, changeLanguage }}>
			{children}
		</LanguageContext.Provider>
	);
}
