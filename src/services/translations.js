import { Storage } from "aws-amplify";

const TRANSLATIONS = ['fr'];

export const getAllTranslations = async () => {
    const translations = await Promise.all(TRANSLATIONS.map(async (langCode) => {
        const translation = await Storage.get(`translations/${langCode}.json`, { download: true, validateObjectExistence: true, contentType: 'application/json', cacheControl: 'no-cache' });
        const translationJSON = await new Response(translation.Body).json();
        return { langCode, translationJSON };
    }));
    return translations;
};


export const updateTranslationWithLangCode = async (langCode, translationObject) => {
    const upload = await Storage.put(`translations/${langCode}.json`, JSON.stringify(translationObject));
}