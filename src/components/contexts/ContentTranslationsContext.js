import React, { useState, useContext, createContext } from 'react';

const ContentTranslationsContext = createContext();
export const useContentTranslationsContext = () => useContext(ContentTranslationsContext);

export default function ContentTranslationsContextProvider ({ children }) {
    const [contentTranslations, setContentTranslations] = useState({});
    return (
        <ContentTranslationsContext.Provider value={{ contentTranslations, setContentTranslations }}>
            {children}
        </ContentTranslationsContext.Provider>
    );
}
