import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en.json';
import translationIT from './locales/it.json';

const resources = {
  en: { translation: translationEN },
  it: { translation: translationIT }
};

i18n
  .use(initReactI18next) // Passa l'istanza a react-i18next
  .init({
    resources,
    lng: 'en', // Lingua di default all'avvio
    fallbackLng: 'en', // Lingua di riserva se manca una traduzione
    interpolation: {
      escapeValue: false // React protegge già dagli attacchi XSS
    }
  });

export default i18n;