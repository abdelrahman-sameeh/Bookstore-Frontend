import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ar from './ar.json';

// Get language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: savedLanguage, // Use the saved language or default to 'en'
    fallbackLng: 'en', // Fallback language if savedLanguage is not available
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
