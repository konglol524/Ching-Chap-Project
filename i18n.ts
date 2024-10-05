// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import translationEN from './src/app/locales/en/translation.json';
import translationTH from './src/app/locales/th/translation.json';

// Define the resources
const resources = {
  en: {
    translation: translationEN,
  },
  th: {
    translation: translationTH,
  },
};

// Initialize i18n
i18n
  .use(initReactI18next) // Initialize with react-i18next
  .init({
    resources,
    lng: 'th', // Set the default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
    react: {
      useSuspense: false, // Important for SSR with Next.js
    },
  });

export default i18n;
