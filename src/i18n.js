import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from './languages/resources';

let sysLanguage = localStorage.getItem('sysLanguage');
if (!sysLanguage) localStorage.setItem('sysLanguage', 'en_US');

i18next.use(LanguageDetector).init({
  // we init with resources
  lng: sysLanguage,
  resources,
  fallbackLng: 'en_US',
  debug: true,
  ns: ['translation'],
  defaultNS: 'translation',
  keySeparator: false, 
  interpolation: {
    escapeValue: false,
    formatSeparator: ','
  },
  react: {
    wait: true
  }
});

export default i18next;
